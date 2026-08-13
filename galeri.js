// ======================================================
// GALERI.JS - MYJOURNEY
// VERSI SUPABASE CLOUD
// ======================================================


// ======================================================
// KONFIGURASI
// ======================================================

const NAMA_BUCKET = "kenangan";
const NAMA_TABEL = "galeri";

// Signed URL berlaku 1 jam
const SIGNED_URL_DURATION = 60 * 60;


// ======================================================
// ELEMENT HTML
// ======================================================

const galleryGrid =
    document.getElementById("galleryGrid");

const photoModal =
    document.getElementById("photoModal");

const modalImage =
    document.getElementById("modalImage");

const uploadFoto =
    document.getElementById("uploadFoto");

const uploadModal =
    document.getElementById("uploadModal");

const uploadPreview =
    document.getElementById("uploadPreview");

const judulFoto =
    document.getElementById("judulFoto");

const lokasiFoto =
    document.getElementById("lokasiFoto");

const tanggalFoto =
    document.getElementById("tanggalFoto");


// ======================================================
// VARIABEL
// ======================================================

let userAktif = null;

let fileFotoDipilih = null;

let previewObjectURL = null;


// ======================================================
// JALANKAN SAAT HALAMAN DIBUKA
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

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


    // ==========================================
    // CEK USER SUPABASE
    // ==========================================

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error
        ||
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


    // ==========================================
    // MUAT GALERI
    // ==========================================

    await tampilkanGaleri();

}



// ======================================================
// LOADING
// ======================================================

function tampilkanLoading(
    pesan
) {

    if (!galleryGrid) {

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
// FORMAT TANGGAL INDONESIA
// ======================================================

function formatTanggalIndonesia(
    tanggalString
) {

    if (!tanggalString) {

        return "-";

    }


    const parts =
        tanggalString
            .split("-");


    if (
        parts.length !== 3
    ) {

        return tanggalString;

    }


    const tahun =
        Number(parts[0]);

    const bulan =
        Number(parts[1]);

    const hari =
        Number(parts[2]);


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
                day: "numeric",
                month: "long",
                year: "numeric"
            }

        );

}



// ======================================================
// AMBIL DATA GALERI DARI DATABASE
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
                created_at
            `)

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Gagal mengambil galeri:",
            error
        );

        throw error;

    }


    return data || [];

}



// ======================================================
// BUAT SIGNED URL FOTO
// ======================================================

async function buatSignedURL(
    fotoPath
) {

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


    if (error) {

        console.error(

            "Gagal membuat URL foto:",

            fotoPath,

            error

        );


        return null;

    }


    return data.signedUrl;

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
        // AMBIL METADATA DARI DATABASE
        // ======================================

        const daftarFoto =
            await ambilDataGaleri();


        // ======================================
        // KOSONGKAN GALERI
        // ======================================

        galleryGrid.innerHTML =
            "";


        // ======================================
        // JIKA BELUM ADA FOTO
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
            const item of daftarFoto
        ) {


            // Buat URL sementara
            // karena bucket private

            const signedURL =
                await buatSignedURL(
                    item.foto_path
                );


            const card =
                buatCardFoto(
                    item,
                    signedURL
                );


            galleryGrid.appendChild(
                card
            );

        }


    }

    catch(error) {


        console.error(
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

                    Periksa koneksi internet
                    atau konfigurasi Supabase.

                </p>

            </div>

        `;

    }

}



// ======================================================
// MEMBUAT CARD FOTO
// ======================================================

function buatCardFoto(
    item,
    signedURL
) {


    // ==========================================
    // CARD
    // ==========================================

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "gallery-card";



    // ==========================================
    // CONTAINER FOTO
    // ==========================================

    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "gallery-image";



    // ==========================================
    // JIKA FOTO BERHASIL DIMUAT
    // ==========================================

    if (signedURL) {


        const image =
            document.createElement(
                "img"
            );


        image.src =
            signedURL;


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
                    signedURL
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

                    justify-content:center;
                    align-items:center;

                    font-size:45px;

                    background:#e5e7eb;
                "
            >

                📷

            </div>

        `;

    }



    // ==========================================
    // INFORMASI
    // ==========================================

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "gallery-info";



    // ==========================================
    // JUDUL
    // ==========================================

    const judul =
        document.createElement(
            "h3"
        );


    judul.textContent =
        item.judul
        ||
        "Foto Kenangan";



    // ==========================================
    // LOKASI
    // ==========================================

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



    // ==========================================
    // TANGGAL
    // ==========================================

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



    // ==========================================
    // TOMBOL
    // ==========================================

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "gallery-actions";



    // ==========================================
    // HAPUS FOTO
    // ==========================================

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

                item.id,

                item.foto_path,

                deleteButton

            );

        }

    );



    // ==========================================
    // MASUKKAN
    // ==========================================

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
// TOMBOL + UPLOAD FOTO
// ======================================================

function pilihFoto() {

    if (!uploadFoto) {

        alert(
            "Input uploadFoto tidak ditemukan."
        );

        return;

    }


    uploadFoto.click();

}



// ======================================================
// KETIKA USER MEMILIH FOTO
// ======================================================

if (uploadFoto) {


    uploadFoto.addEventListener(

        "change",

        function() {


            const file =
                uploadFoto.files[0];


            if (!file) {

                return;

            }



            // ======================================
            // VALIDASI FILE GAMBAR
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
            // BATASI 5 MB
            // ======================================

            const maksimalUkuran =
                5
                *
                1024
                *
                1024;


            if (
                file.size
                >
                maksimalUkuran
            ) {


                alert(

                    "Ukuran foto terlalu besar.\n\n"

                    +

                    "Gunakan foto maksimal 5 MB."

                );


                uploadFoto.value =
                    "";


                return;

            }



            // ======================================
            // SIMPAN FILE
            // ======================================

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
            // BUAT PREVIEW
            // ======================================

            previewObjectURL =

                URL.createObjectURL(
                    fileFotoDipilih
                );


            if (uploadPreview) {


                uploadPreview.src =
                    previewObjectURL;

            }



            // ======================================
            // TAMPILKAN MODAL
            // ======================================

            if (uploadModal) {


                uploadModal.style.display =
                    "flex";

            }

        }

    );

}



// ======================================================
// MEMBUAT NAMA FILE AMAN
// ======================================================

function buatNamaFile(
    file
) {


    let extension =
        "jpg";


    if (
        file.name
        &&
        file.name.includes(".")
    ) {


        extension =

            file.name

                .split(".")

                .pop()

                .toLowerCase()

                .replace(
                    /[^a-z0-9]/g,
                    ""
                );

    }


    if (!extension) {

        extension =
            "jpg";

    }


    const random =

        Math.random()

            .toString(36)

            .substring(2, 10);


    return (

        Date.now()

        +

        "-"

        +

        random

        +

        "."

        +

        extension

    );

}



// ==========================================
// SIMPAN FOTO
// GOOGLE DRIVE + SUPABASE METADATA
// ==========================================


async function simpanFoto() {

// ============================================
// USER SUPABASE
// ============================================

if (!userAktif){
    
    alert(
        "Session login tidak ditemukan."
    );

    window.location.href =
        "index.html";

    return;

}

// ============================================
// FILE
// ============================================

if (!fileFotoDipilih){

    alert(
        "Silahkan pilih foto terlebih dahulu."
    );

    return;
}

// =============================================
// DATA FORM
// =============================================

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

// ============================================
// VALIDASI
// ============================================

if (!judul){

    alert(
        "Judul foto harus diisi."
    );

    judulFoto.focus();

    return;
}

// ===========================================
// TOMBOL SIMPAN
// ===========================================

    const tombolSimpan =
    document.querySelector(
        ".save-upload"
    );


    if (tombolSimpan){

        tombolSimpan.disabled =
            true;

        tombolSimpan.innerText =
            "Menyimpan.......";
    }

    try {
// =========================================
// // 1. PASTKAN GOOGLE TERHUBUNG
// =========================================

        if (tombolSimpan){

            tombolSimpan.innerText =
              "Menghubungkan Google Drive.....";
        }

        await pastikanGoogleDriveTerhubung();

 //========================================
// 2. PASTIKAN FOLDER MYJOURNEY
//========================================

        if (tombolSimpan){

            tombolSimpan.innerText =
                "Menyiapkan folder.....";
        }

        const folderId =
            await pastikanFolderMyJourney(
                false
            );

        if (!folderId){

            throw new Error(
                "Folder MyJourney tidak dapat disiapkan."
            );
        }

 // =====================================
 // 3. UPLOAD FILE KE GOOGLE DRIVE
 // =====================================

        if (tombolSimpan){
            tombolSimpan.innerText =
                "Mengupload foto....";
        }

        const hasilGoogle =
        await uploadFileKeGoogleDrive(
            fileFotoDipilih
        );

        if(
            !hasilGoogle
            ||
            !hasilGoogle.id
        ) {
            throw new Error(
                "Upload ke Google Drive Gagal."
            );
        }

        console.log(
            "Google File ID:",
            hasilGoogle.id
        );

//============================================
// 4. SIMPAN METADATA KE SUPABASE
//============================================

        if (tombolSimpan){
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
                lokasi
                ||
                null,

                tanggal:
                tanggal
                ||
                null,

                foto_path:
                null,

                google_filde_id:
                hasilGoogle.id,

                google_file_name:
                hasilGoogle.name
            });

        if (databaseError){

            console.error(
                databaseError
            );

            throw new Error(
                "Foto berhasi masuk Google Drive,"
                +
                "tetapi metadata Superbase gagal:"
                +
                databaseError.message
            );
        }

        // ========================================
        // 5. BERHASIL
        // ========================================

        resetFormUpload();

        if(uploadModal){
            "none";
        }

        alert(
            "Foto berhasil disimpan ke Google Drive! 📸✅"
        );

        // Untuk sementara refresh data galeri
        await tampilkanGaleri();

    }

    catch(error){
        console.error(
            "Simpan Foto Error:",
            error
        );

    alert(
        "Foto gagal disimppan.\n\n"

        +

        error.message
    );


    }

    finally {
        if(tombolSimpan){
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


    if (uploadFoto) {

        uploadFoto.value =
            "";

    }


    if (judulFoto) {

        judulFoto.value =
            "";

    }


    if (lokasiFoto) {

        lokasiFoto.value =
            "";

    }


    if (tanggalFoto) {

        tanggalFoto.value =
            "";

    }


    if (uploadPreview) {

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


    if (uploadModal) {


        uploadModal.style.display =
            "none";

    }


    resetFormUpload();

}



// ======================================================
// BUKA FOTO BESAR
// ======================================================

function bukaFoto(
    signedURL
) {


    if (
        !photoModal
        ||
        !modalImage
    ) {

        return;

    }


    modalImage.src =
        signedURL;


    photoModal.style.display =
        "flex";

}



// ======================================================
// TUTUP FOTO BESAR
// ======================================================

function tutupFoto() {


    if (photoModal) {


        photoModal.style.display =
            "none";

    }


    if (modalImage) {


        modalImage.src =
            "";

    }

}



// ======================================================
// HAPUS FOTO
// ======================================================

async function hapusFoto(
    id,
    fotoPath,
    tombol
) {


    const yakin =
        confirm(

            "Apakah kamu yakin ingin menghapus foto ini?"

        );


    if (!yakin) {

        return;

    }



    if (tombol) {


        tombol.disabled =
            true;


        tombol.innerText =
            "Menghapus...";

    }



    try {


        // ======================================
        // 1. HAPUS FILE DARI STORAGE
        // ======================================

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
                    fotoPath
                ]);



        if (
            storageError
        ) {


            throw new Error(

                "Gagal menghapus file: "

                +

                storageError.message

            );

        }



        // ======================================
        // 2. HAPUS METADATA DATABASE
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
                    id
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
        // BERHASIL
        // ======================================

        await tampilkanGaleri();


        alert(

            "Foto berhasil dihapus! 🗑️"

        );


    }

    catch(error) {


        console.error(
            error
        );


        alert(

            "Foto gagal dihapus.\n\n"

            +

            error.message

        );


        if (tombol) {


            tombol.disabled =
                false;


            tombol.innerText =
                "🗑 Hapus Foto";

        }

    }

}



// ======================================================
// KLIK AREA HITAM FOTO BESAR
// ======================================================

if (photoModal) {


    photoModal.addEventListener(

        "click",

        function(event) {


            if (
                event.target
                ===
                photoModal
            ) {


                tutupFoto();

            }

        }

    );

}



// ======================================================
// KLIK AREA HITAM MODAL UPLOAD
// ======================================================

if (uploadModal) {


    uploadModal.addEventListener(

        "click",

        function(event) {


            if (
                event.target
                ===
                uploadModal
            ) {


                batalUpload();

            }

        }

    );

}



// ======================================================
// TOMBOL ESC
// ======================================================

document.addEventListener(

    "keydown",

    function(event) {


        if (
            event.key
            !==
            "Escape"
        ) {

            return;

        }


        if (
            photoModal
            &&
            photoModal.style.display
            ===
            "flex"
        ) {


            tutupFoto();

        }


        if (
            uploadModal
            &&
            uploadModal.style.display
            ===
            "flex"
        ) {


            batalUpload();

        }

    }

);



// ======================================================
// LOGOUT SUPABASE
// ======================================================

async function logout() {


    const {
        error
    } =

        await supabaseClient
            .auth
            .signOut({
                scope: "local"
            });


    if (error) {


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
