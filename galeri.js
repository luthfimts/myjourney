// ======================================================
// GALERI.JS - MYJOURNEY
// SUPABASE DATABASE + SUPABASE STORAGE + GOOGLE DRIVE
// ======================================================


// ======================================================
// KONFIGURASI
// ======================================================

const NAMA_BUCKET = "kenangan";

const NAMA_TABEL = "galeri";

const SIGNED_URL_DURATION =
    60 * 60;


// Maksimal foto 50 MB
const MAKSIMAL_UKURAN_FOTO =
    50 * 1024 * 1024;



// ======================================================
// ELEMENT HTML
// ======================================================

const galleryGrid =
    document.getElementById(
        "galleryGrid"
    );


const photoModal =
    document.getElementById(
        "photoModal"
    );


const modalImage =
    document.getElementById(
        "modalImage"
    );


const uploadFoto =
    document.getElementById(
        "uploadFoto"
    );


const uploadModal =
    document.getElementById(
        "uploadModal"
    );


const uploadPreview =
    document.getElementById(
        "uploadPreview"
    );


const judulFoto =
    document.getElementById(
        "judulFoto"
    );


const lokasiFoto =
    document.getElementById(
        "lokasiFoto"
    );


const tanggalFoto =
    document.getElementById(
        "tanggalFoto"
    );



// ======================================================
// VARIABEL
// ======================================================

let userAktif =
    null;


let fileFotoDipilih =
    null;


let previewObjectURL =
    null;


// Menyimpan Blob URL Google Drive
// supaya bisa dibersihkan ketika refresh galeri
let googleBlobURLs =
    [];



// ======================================================
// MULAI
// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    async function() {

        await mulaiGaleri();

    }

);



// ======================================================
// MULAI GALERI
// ======================================================

async function mulaiGaleri() {


    tampilkanLoading(
        "Memuat Galeri Kenangan..."
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data.user
    ) {


        console.error(
            "User tidak ditemukan:",
            error
        );


        window.location.href =
            "index.html";


        return;
    }


    userAktif =
        data.user;


    console.log(
        "Login sebagai:",
        userAktif.email
    );


    await tampilkanGaleri();

}



// ======================================================
// LOADING
// ======================================================

function tampilkanLoading(
    pesan
) {


    if (
        !galleryGrid
    ) {

        return;
    }


    galleryGrid.innerHTML = `

        <div class="empty-gallery">

            <div
                class="icon"
                style="
                    font-size:45px;
                    margin-bottom:15px;
                "
            >

                ⏳

            </div>


            <h2>
                ${pesan}
            </h2>

        </div>

    `;

}



// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatTanggalIndonesia(
    tanggalString
) {


    if (
        !tanggalString
    ) {

        return "-";
    }


    const parts =
        tanggalString.split("-");


    if (
        parts.length !== 3
    ) {

        return tanggalString;
    }


    const tahun =
        Number(
            parts[0]
        );


    const bulan =
        Number(
            parts[1]
        );


    const hari =
        Number(
            parts[2]
        );


    const tanggal =
        new Date(

            tahun,

            bulan - 1,

            hari

        );


    return tanggal
        .toLocaleDateString(

            "id-ID",

            {

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"

            }

        );

}



// ======================================================
// AMBIL DATA GALERI DARI SUPABASE
// ======================================================

async function ambilDataGaleri() {


    const {
        data,
        error
    } =

        await supabaseClient

            .from(
                NAMA_TABEL
            )

            .select(`
                id,
                judul,
                lokasi,
                tanggal,
                foto_path,
                google_file_id,
                google_file_name,
                created_at
            `)

            .order(

                "created_at",

                {
                    ascending:
                        false
                }

            );


    if (
        error
    ) {


        console.error(
            "Gagal mengambil galeri:",
            error
        );


        throw error;
    }


    return data || [];

}



// ======================================================
// SUPABASE STORAGE
// BUAT SIGNED URL FOTO LAMA
// ======================================================

async function buatSignedURL(
    fotoPath
) {


    if (
        !fotoPath
    ) {

        return null;
    }


    const {
        data,
        error
    } =

        await supabaseClient

            .storage

            .from(
                NAMA_BUCKET
            )

            .createSignedUrl(

                fotoPath,

                SIGNED_URL_DURATION

            );


    if (
        error
    ) {


        console.error(

            "Gagal membuat Signed URL:",

            fotoPath,

            error

        );


        return null;
    }


    return data.signedUrl;

}



// ======================================================
// GOOGLE DRIVE
// AMBIL FOTO PRIVATE
// ======================================================

async function ambilURLGoogleDrive(
    googleFileId
) {


    if (
        !googleFileId
    ) {

        return null;
    }


    try {


        // ======================================
        // PASTIKAN GOOGLE DRIVE TERHUBUNG
        // ======================================

        const token =
            await pastikanGoogleDriveTerhubung();


        if (
            !token
        ) {

            return null;
        }



        // ======================================
        // DOWNLOAD FILE DARI GOOGLE DRIVE
        // ======================================

        const response =
            await fetch(

                "https://www.googleapis.com/drive/v3/files/"

                +

                encodeURIComponent(
                    googleFileId
                )

                +

                "?alt=media",

                {

                    method:
                        "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );



        if (
            !response.ok
        ) {


            console.error(

                "Gagal mengambil foto Google Drive.",

                googleFileId,

                response.status

            );


            return null;
        }



        // ======================================
        // UBAH MENJADI BLOB
        // ======================================

        const blob =
            await response.blob();



        // ======================================
        // BUAT URL UNTUK IMG
        // ======================================

        const objectURL =
            URL.createObjectURL(
                blob
            );


        googleBlobURLs.push(
            objectURL
        );


        return objectURL;


    }

    catch(error) {


        console.error(

            "Gagal memuat foto Google Drive:",

            googleFileId,

            error

        );


        // Jangan membuat seluruh galeri gagal
        return null;

    }

}



// ======================================================
// BERSIHKAN BLOB URL GOOGLE
// ======================================================

function bersihkanGoogleBlobURLs() {


    for (
        const url
        of
        googleBlobURLs
    ) {


        try {

            URL.revokeObjectURL(
                url
            );

        }

        catch(error) {

            console.error(
                error
            );

        }

    }


    googleBlobURLs =
        [];

}



// ======================================================
// TAMPILKAN GALERI
// ======================================================

async function tampilkanGaleri() {


    tampilkanLoading(
        "Memuat foto..."
    );


    try {


        // ======================================
        // BERSIHKAN URL GOOGLE LAMA
        // ======================================

        bersihkanGoogleBlobURLs();



        // ======================================
        // AMBIL DATA DATABASE
        // ======================================

        const daftarFoto =
            await ambilDataGaleri();



        galleryGrid.innerHTML =
            "";



        // ======================================
        // BELUM ADA FOTO
        // ======================================

        if (
            daftarFoto.length === 0
        ) {


            galleryGrid.innerHTML = `

                <div class="empty-gallery">

                    <div class="icon">
                        📷
                    </div>


                    <h2>
                        Belum ada foto kenangan
                    </h2>


                    <p>
                        Klik tombol + Upload Foto
                        untuk menambahkan foto.
                    </p>

                </div>

            `;


            return;
        }



        // ======================================
        // TAMPILKAN SATU PER SATU
        // ======================================

        for (
            const item
            of
            daftarFoto
        ) {


            let imageURL =
                null;



            // ==================================
            // FOTO GOOGLE DRIVE
            // ==================================

            if (
                item.google_file_id
            ) {


                imageURL =
                    await ambilURLGoogleDrive(

                        item.google_file_id

                    );

            }



            // ==================================
            // FOTO LAMA SUPABASE STORAGE
            // ==================================

            else if (
                item.foto_path
            ) {


                imageURL =
                    await buatSignedURL(

                        item.foto_path

                    );

            }



            // ==================================
            // BUAT CARD
            // ==================================

            const card =
                buatCardFoto(

                    item,

                    imageURL

                );


            galleryGrid.appendChild(
                card
            );

        }


    }

    catch(error) {


        console.error(
            "Tampilkan Galeri Error:",
            error
        );


        galleryGrid.innerHTML = `

            <div class="empty-gallery">

                <div class="icon">
                    ⚠️
                </div>


                <h2>
                    Galeri gagal dimuat
                </h2>


                <p>
                    Terjadi kesalahan saat
                    mengambil data galeri.
                </p>

            </div>

        `;

    }

}



// ======================================================
// BUAT CARD FOTO
// ======================================================

function buatCardFoto(
    item,
    imageURL
) {


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "gallery-card";



    // ==================================================
    // GAMBAR
    // ==================================================

    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "gallery-image";



    if (
        imageURL
    ) {


        const image =
            document.createElement(
                "img"
            );


        image.src =
            imageURL;


        image.alt =
            item.judul
            ||
            "Foto Kenangan";


        image.loading =
            "lazy";


        image.addEventListener(

            "click",

            function() {

                bukaFoto(
                    imageURL
                );

            }

        );


        imageContainer.appendChild(
            image
        );


    }

    else {


        imageContainer.innerHTML = `

            <div
                style="
                    width:100%;
                    height:100%;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    font-size:40px;
                    background:#e5e7eb;
                    color:#6b7280;
                    text-align:center;
                    padding:15px;
                "
            >

                📷

                <div
                    style="
                        font-size:12px;
                        margin-top:8px;
                    "
                >
                    Foto belum dapat dimuat
                </div>

            </div>

        `;

    }



    // ==================================================
    // INFORMASI
    // ==================================================

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "gallery-info";



    const judul =
        document.createElement(
            "h3"
        );


    judul.textContent =
        item.judul
        ||
        "Foto Kenangan";



    const lokasi =
        document.createElement(
            "p"
        );


    lokasi.textContent =

        "📍 "

        +

        (
            item.lokasi
            ||
            "Lokasi tidak dicantumkan"
        );



    const tanggal =
        document.createElement(
            "p"
        );


    tanggal.className =
        "date";


    tanggal.textContent =

        "📅 "

        +

        formatTanggalIndonesia(
            item.tanggal
        );



    // ==================================================
    // SUMBER FOTO
    // ==================================================

    const sumber =
        document.createElement(
            "p"
        );


    if (
        item.google_file_id
    ) {


        sumber.textContent =
            "☁ Google Drive";

    }

    else {


        sumber.textContent =
            "☁ Supabase";

    }



    // ==================================================
    // ACTIONS
    // ==================================================

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "gallery-actions";



    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "delete-photo-btn";


    deleteButton.innerHTML =
        "🗑 Hapus Foto";



    deleteButton.addEventListener(

        "click",

        async function(event) {


            event.preventDefault();

            event.stopPropagation();


            await hapusFoto(

                item,

                deleteButton

            );

        }

    );



    actions.appendChild(
        deleteButton
    );


    info.appendChild(
        judul
    );


    info.appendChild(
        lokasi
    );


    info.appendChild(
        tanggal
    );


    info.appendChild(
        sumber
    );


    info.appendChild(
        actions
    );


    card.appendChild(
        imageContainer
    );


    card.appendChild(
        info
    );


    return card;

}



// ======================================================
// + UPLOAD FOTO
// ======================================================

function pilihFoto() {


    if (
        !uploadFoto
    ) {


        alert(
            "Input uploadFoto tidak ditemukan."
        );


        return;
    }


    uploadFoto.click();

}



// ======================================================
// PILIH FILE FOTO
// ======================================================

if (
    uploadFoto
) {


    uploadFoto.addEventListener(

        "change",

        function() {


            const file =
                uploadFoto.files?.[0];



            if (
                !file
            ) {

                return;
            }



            // ======================================
            // HARUS GAMBAR
            // ======================================

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {


                alert(
                    "File harus berupa gambar."
                );


                uploadFoto.value =
                    "";


                return;
            }



            // ======================================
            // BATAS 50 MB
            // ======================================

            if (
                file.size >
                MAKSIMAL_UKURAN_FOTO
            ) {


                alert(

                    "Ukuran foto terlalu besar.\n\n"

                    +

                    "Gunakan foto maksimal 50 MB."

                );


                uploadFoto.value =
                    "";


                return;
            }



            fileFotoDipilih =
                file;



            // ======================================
            // HAPUS PREVIEW LAMA
            // ======================================

            if (
                previewObjectURL
            ) {


                URL.revokeObjectURL(
                    previewObjectURL
                );

            }



            // ======================================
            // PREVIEW BARU
            // ======================================

            previewObjectURL =
                URL.createObjectURL(
                    fileFotoDipilih
                );


            if (
                uploadPreview
            ) {


                uploadPreview.src =
                    previewObjectURL;

            }



            // ======================================
            // TAMPILKAN MODAL
            // ======================================

            if (
                uploadModal
            ) {


                uploadModal.style.display =
                    "flex";

            }

        }

    );

}



// ======================================================
// SIMPAN FOTO
// GOOGLE DRIVE + SUPABASE METADATA
// ======================================================

async function simpanFoto() {


    if (
        !userAktif
    ) {


        alert(
            "Session login tidak ditemukan."
        );


        window.location.href =
            "index.html";


        return;
    }



    if (
        !fileFotoDipilih
    ) {


        alert(
            "Silakan pilih foto terlebih dahulu."
        );


        return;
    }



    // ==================================================
    // FORM
    // ==================================================

    const judul =
        judulFoto
        ?
        judulFoto.value.trim()
        :
        "";


    const lokasi =
        lokasiFoto
        ?
        lokasiFoto.value.trim()
        :
        "";


    const tanggal =
        tanggalFoto
        ?
        tanggalFoto.value
        :
        "";



    if (
        !judul
    ) {


        alert(
            "Judul foto harus diisi."
        );


        judulFoto?.focus();


        return;
    }



    const tombolSimpan =
        document.querySelector(
            ".save-upload"
        );



    if (
        tombolSimpan
    ) {


        tombolSimpan.disabled =
            true;


        tombolSimpan.innerText =
            "Menyimpan...";

    }



    let hasilGoogle =
        null;



    try {


        // ======================================
        // GOOGLE DRIVE
        // ======================================

        if (
            tombolSimpan
        ) {

            tombolSimpan.innerText =
                "Menghubungkan Google Drive...";

        }


        await pastikanGoogleDriveTerhubung();



        // ======================================
        // PASTIKAN FOLDER
        // ======================================

        if (
            tombolSimpan
        ) {

            tombolSimpan.innerText =
                "Menyiapkan folder...";

        }


        const folderId =
            await pastikanFolderMyJourney(
                false
            );


        if (
            !folderId
        ) {


            throw new Error(
                "Folder MyJourney tidak dapat disiapkan."
            );

        }



        // ======================================
        // UPLOAD GOOGLE DRIVE
        // ======================================

        if (
            tombolSimpan
        ) {

            tombolSimpan.innerText =
                "Mengupload foto...";

        }


        hasilGoogle =
            await uploadFileKeGoogleDrive(

                fileFotoDipilih

            );



        if (
            !hasilGoogle ||
            !hasilGoogle.id
        ) {


            throw new Error(
                "Upload ke Google Drive gagal."
            );

        }



        // ======================================
        // SIMPAN DATABASE
        // ======================================

        if (
            tombolSimpan
        ) {

            tombolSimpan.innerText =
                "Menyimpan data...";

        }



        const {
            error:
                databaseError
        } =

            await supabaseClient

                .from(
                    NAMA_TABEL
                )

                .insert({

                    user_id:
                        userAktif.id,

                    judul:
                        judul,

                    lokasi:
                        lokasi || null,

                    tanggal:
                        tanggal || null,

                    foto_path:
                        null,

                    google_file_id:
                        hasilGoogle.id,

                    google_file_name:
                        hasilGoogle.name

                });



        if (
            databaseError
        ) {


            console.error(
                databaseError
            );


            // Jika metadata gagal,
            // coba hapus kembali file Google Drive
            try {


                await hapusFileGoogleDrive(

                    hasilGoogle.id

                );


            }

            catch(errorHapus) {


                console.error(

                    "Gagal membersihkan file Google Drive:",

                    errorHapus

                );

            }



            throw new Error(

                "Metadata Supabase gagal disimpan: "

                +

                databaseError.message

            );

        }



        // ======================================
        // SUKSES
        // ======================================

        resetFormUpload();



        if (
            uploadModal
        ) {


            uploadModal.style.display =
                "none";

        }



        alert(
            "Foto berhasil disimpan! 📸✅"
        );



        await tampilkanGaleri();


    }

    catch(error) {


        console.error(
            "Simpan Foto Error:",
            error
        );


        alert(

            "Foto gagal disimpan.\n\n"

            +

            error.message

        );

    }

    finally {


        if (
            tombolSimpan
        ) {


            tombolSimpan.disabled =
                false;


            tombolSimpan.innerText =
                "Simpan Foto";

        }

    }

}



// ======================================================
// RESET FORM
// ======================================================

function resetFormUpload() {


    fileFotoDipilih =
        null;


    if (
        uploadFoto
    ) {


        uploadFoto.value =
            "";

    }


    if (
        judulFoto
    ) {


        judulFoto.value =
            "";

    }


    if (
        lokasiFoto
    ) {


        lokasiFoto.value =
            "";

    }


    if (
        tanggalFoto
    ) {


        tanggalFoto.value =
            "";

    }


    if (
        uploadPreview
    ) {


        uploadPreview.src =
            "";

    }


    if (
        previewObjectURL
    ) {


        URL.revokeObjectURL(
            previewObjectURL
        );


        previewObjectURL =
            null;

    }

}



// ======================================================
// BATAL UPLOAD
// ======================================================

function batalUpload() {


    if (
        uploadModal
    ) {


        uploadModal.style.display =
            "none";

    }


    resetFormUpload();

}



// ======================================================
// BUKA FOTO
// ======================================================

function bukaFoto(
    imageURL
) {


    if (
        !photoModal ||
        !modalImage
    ) {

        return;
    }


    modalImage.src =
        imageURL;


    photoModal.style.display =
        "flex";

}



// ======================================================
// TUTUP FOTO
// ======================================================

function tutupFoto() {


    if (
        photoModal
    ) {


        photoModal.style.display =
            "none";

    }


    if (
        modalImage
    ) {


        modalImage.src =
            "";

    }

}



// ======================================================
// HAPUS FILE GOOGLE DRIVE
// ======================================================

async function hapusFileGoogleDrive(
    googleFileId
) {


    if (
        !googleFileId
    ) {

        return;
    }


    const token =
        await pastikanGoogleDriveTerhubung();



    const response =
        await fetch(

            "https://www.googleapis.com/drive/v3/files/"

            +

            encodeURIComponent(
                googleFileId
            ),

            {

                method:
                    "DELETE",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );



    if (
        !response.ok
    ) {


        let pesan =
            "Gagal menghapus file Google Drive.";


        try {


            const data =
                await response.json();


            pesan =
                data
                    ?.error
                    ?.message
                ||
                pesan;


        }

        catch(error) {


            console.error(
                error
            );

        }



        throw new Error(
            pesan
        );

    }

}



// ======================================================
// HAPUS FOTO
// GOOGLE DRIVE / SUPABASE STORAGE
// ======================================================

async function hapusFoto(
    item,
    tombol
) {


    const yakin =
        confirm(
            "Apakah kamu yakin ingin menghapus foto ini?"
        );


    if (
        !yakin
    ) {

        return;
    }



    if (
        tombol
    ) {


        tombol.disabled =
            true;


        tombol.innerText =
            "Menghapus...";

    }



    try {


        // ======================================
        // FOTO GOOGLE DRIVE
        // ======================================

        if (
            item.google_file_id
        ) {


            await hapusFileGoogleDrive(

                item.google_file_id

            );

        }



        // ======================================
        // FOTO LAMA SUPABASE STORAGE
        // ======================================

        else if (
            item.foto_path
        ) {


            const {
                error:
                    storageError
            } =

                await supabaseClient

                    .storage

                    .from(
                        NAMA_BUCKET
                    )

                    .remove([
                        item.foto_path
                    ]);



            if (
                storageError
            ) {


                throw new Error(

                    "Gagal menghapus file Supabase: "

                    +

                    storageError.message

                );

            }

        }



        // ======================================
        // HAPUS DATABASE
        // ======================================

        const {
            error:
                databaseError
        } =

            await supabaseClient

                .from(
                    NAMA_TABEL
                )

                .delete()

                .eq(
                    "id",
                    item.id
                );



        if (
            databaseError
        ) {


            throw new Error(

                "Gagal menghapus data galeri: "

                +

                databaseError.message

            );

        }



        // ======================================
        // SUKSES
        // ======================================

        await tampilkanGaleri();


        alert(
            "Foto berhasil dihapus! 🗑️"
        );


    }

    catch(error) {


        console.error(
            "Hapus Foto Error:",
            error
        );


        alert(

            "Foto gagal dihapus.\n\n"

            +

            error.message

        );


        if (
            tombol
        ) {


            tombol.disabled =
                false;


            tombol.innerText =
                "🗑 Hapus Foto";

        }

    }

}



// ======================================================
// KLIK BACKGROUND FOTO MODAL
// ======================================================

if (
    photoModal
) {


    photoModal.addEventListener(

        "click",

        function(event) {


            if (
                event.target ===
                photoModal
            ) {


                tutupFoto();

            }

        }

    );

}



// ======================================================
// KLIK BACKGROUND UPLOAD MODAL
// ======================================================

if (
    uploadModal
) {


    uploadModal.addEventListener(

        "click",

        function(event) {


            if (
                event.target ===
                uploadModal
            ) {


                batalUpload();

            }

        }

    );

}



// ======================================================
// ESC
// ======================================================

document.addEventListener(

    "keydown",

    function(event) {


        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        if (
            photoModal &&
            photoModal.style.display ===
            "flex"
        ) {


            tutupFoto();

        }


        if (
            uploadModal &&
            uploadModal.style.display ===
            "flex"
        ) {


            batalUpload();

        }

    }

);



// ======================================================
// LOGOUT
// ======================================================

async function logout() {


    const {
        error
    } =

        await supabaseClient
            .auth
            .signOut({
                scope:
                    "local"
            });



    if (
        error
    ) {


        console.error(
            "Logout gagal:",
            error
        );


        alert(
            "Logout gagal."
        );


        return;
    }


    window.location.href =
        "index.html";

}
