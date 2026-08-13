const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";

const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";

let googleAccessToken = null;
let googleTokenClient = null;
let googleFolderId = null;

// ======================================================
// CARI FOLDER MYJOURNEY
// ======================================================

async function cariFolderMyJourney() {

    if (!googleAccessToken) {

        alert(
            "Google Drive belum terhubung.\n\n" +
            "Klik Hubungkan Google Drive terlebih dahulu."
        );

        return null;
    }


    try {

        const query =
            "name = 'MyJourney' " +
            "and mimeType = 'application/vnd.google-apps.folder' " +
            "and trashed = false";


        const url =
            new URL(
                "https://www.googleapis.com/drive/v3/files"
            );


        url.searchParams.set(
            "q",
            query
        );


        url.searchParams.set(
            "spaces",
            "drive"
        );


        url.searchParams.set(
            "fields",
            "files(id,name)"
        );


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`

                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Hasil pencarian folder:",
            data
        );


        if (!response.ok) {

            const pesan =
                data?.error?.message
                ||
                "Gagal mencari folder.";


            alert(
                "Gagal mencari folder MyJourney.\n\n"
                +
                pesan
            );


            return null;
        }


        // ======================================
        // JIKA FOLDER DITEMUKAN
        // ======================================

        if (
            data.files
            &&
            data.files.length > 0
        ) {

            googleFolderId =
                data.files[0].id;


            console.log(
                "Folder MyJourney ditemukan:",
                googleFolderId
            );


            return googleFolderId;
        }


        // ======================================
        // BELUM ADA FOLDER
        // ======================================

        return null;

    }

    catch(error) {

        console.error(
            "Error mencari folder:",
            error
        );


        return null;
    }

}





// ======================================================
// CARI / BUAT FOLDER MYJOURNEY
// ======================================================

async function buatFolderMyJourney() {

    if (!googleAccessToken) {

        alert(
            "Google Drive belum terhubung.\n\n" +
            "Klik Hubungkan Google Drive terlebih dahulu."
        );

        return;
    }


    // ==========================================
    // 1. CARI FOLDER TERLEBIH DAHULU
    // ==========================================

    const folderYangAda =
        await cariFolderMyJourney();


    // ==========================================
    // 2. JIKA SUDAH ADA
    // ==========================================

    if (folderYangAda) {

        googleFolderId =
            folderYangAda;


        alert(
            "Folder MyJourney sudah ada dan siap digunakan! 📁✅"
        );


        return;
    }


    // ==========================================
    // 3. JIKA BELUM ADA, BUAT BARU
    // ==========================================

    try {

        const response =
            await fetch(

                "https://www.googleapis.com/drive/v3/files?fields=id,name",

                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            name:
                                "MyJourney",

                            mimeType:
                                "application/vnd.google-apps.folder"

                        })

                }

            );


        const data =
            await response.json();


        if (!response.ok) {

            const pesan =
                data?.error?.message
                ||
                "Gagal membuat folder.";


            alert(
                "Gagal membuat folder MyJourney.\n\n"
                +
                pesan
            );


            return;
        }


        // ======================================
        // SIMPAN FOLDER ID
        // ======================================

        googleFolderId =
            data.id;


        console.log(
            "Folder MyJourney dibuat:",
            googleFolderId
        );


        alert(
            "Folder MyJourney berhasil dibuat! 📁✅"
        );

    }

    catch(error) {

        console.error(
            "Error membuat folder:",
            error
        );


        alert(
            "Tidak dapat membuat folder MyJourney."
        );
    }

}


// ======================================================
// UPLOAD FILE KE GOOGLE DRIVE - RESUMABLE
// ======================================================

async function uploadFileKeGoogleDrive(file) {

    // ==========================================
    // CEK LOGIN GOOGLE
    // ==========================================

    if (!googleAccessToken) {

        alert(
            "Google Drive belum terhubung.\n\n" +
            "Klik Hubungkan Google Drive terlebih dahulu."
        );

        return null;
    }


    // ==========================================
    // CEK FOLDER
    // ==========================================

    if (!googleFolderId) {

        alert(
            "Folder MyJourney belum siap.\n\n" +
            "Klik Buat Folder MyJourney terlebih dahulu."
        );

        return null;
    }


    // ==========================================
    // CEK FILE
    // ==========================================

    if (!file) {

        alert(
            "Pilih foto terlebih dahulu."
        );

        return null;
    }


    try {

        // ======================================
        // NAMA FILE
        // ======================================

        const namaFile =
            Date.now()
            +
            "-"
            +
            file.name;


        // ======================================
        // METADATA
        // ======================================

        const metadata = {

            name:
                namaFile,

            parents: [
                googleFolderId
            ]

        };


        console.log(
            "Memulai upload:",
            namaFile
        );


        // ======================================
        // LANGKAH 1
        // BUAT RESUMABLE UPLOAD SESSION
        // ======================================

        const sessionResponse =
            await fetch(

                "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size",

                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`,

                        "Content-Type":
                            "application/json; charset=UTF-8",

                        "X-Upload-Content-Type":
                            file.type
                            ||
                            "application/octet-stream",

                        "X-Upload-Content-Length":
                            file.size.toString()

                    },

                    body:
                        JSON.stringify(
                            metadata
                        )

                }

            );


        // ======================================
        // SESSION GAGAL
        // ======================================

        if (!sessionResponse.ok) {

            let errorData = {};

            try {

                errorData =
                    await sessionResponse.json();

            }

            catch(error) {

                console.error(error);

            }


            console.error(
                "Gagal membuat upload session:",
                errorData
            );


            alert(

                "Gagal memulai upload.\n\n"

                +

                (
                    errorData
                        ?.error
                        ?.message
                    ||
                    "Error Google Drive."
                )

            );


            return null;
        }


        // ======================================
        // AMBIL URL SESSION
        // ======================================

        const uploadUrl =
            sessionResponse
                .headers
                .get(
                    "Location"
                );


        if (!uploadUrl) {

            console.error(
                "Upload URL tidak ditemukan."
            );


            alert(
                "Google Drive tidak memberikan URL upload."
            );


            return null;
        }


        console.log(
            "Upload session berhasil dibuat."
        );


        // ======================================
        // LANGKAH 2
        // KIRIM FILE
        // ======================================

        const uploadResponse =
            await fetch(

                uploadUrl,

                {

                    method:
                        "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`,

                        "Content-Type":
                            file.type
                            ||
                            "application/octet-stream"

                    },

                    body:
                        file

                }

            );


        // ======================================
        // AMBIL HASIL
        // ======================================

        let data = {};


        try {

            data =
                await uploadResponse.json();

        }

        catch(error) {

            console.error(
                "Response bukan JSON:",
                error
            );

        }


        // ======================================
        // UPLOAD GAGAL
        // ======================================

        if (!uploadResponse.ok) {

            console.error(
                "Upload gagal:",
                data
            );


            alert(

                "Upload foto gagal.\n\n"

                +

                (
                    data
                        ?.error
                        ?.message
                    ||
                    "Error tidak diketahui."
                )

            );


            return null;
        }


        // ======================================
        // BERHASIL
        // ======================================

        console.log(
            "File berhasil diupload:",
            data
        );


        alert(

            "Foto berhasil diupload ke Google Drive! 📸✅\n\n"

            +

            "Nama: "

            +

            data.name

        );


        return data;

    }

    catch(error) {

        console.error(
            "Upload Google Drive Error:",
            error
        );


        alert(

            "Terjadi kesalahan saat upload.\n\n"

            +

            error.message

        );


        return null;
    }

}


window.uploadFileKeGoogleDrive =
    uploadFileKeGoogleDrive;


// ==========================================
// INISIALISASI GOOGLE DRIVE
// ==========================================

function initGoogleDriveAuth() {

    console.log("Mencoba menginisialisasi Google Drive...");


    // Pastikan library Google sudah termuat
    if (
        typeof google === "undefined"
        ||
        !google.accounts
        ||
        !google.accounts.oauth2
    ) {

        console.error(
            "Google Identity Services belum termuat."
        );

        return;
    }


    googleTokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id: GOOGLE_CLIENT_ID,

            scope: GOOGLE_DRIVE_SCOPE,

            callback: function(response) {

                console.log(
                    "Response Google:",
                    response
                );


                if (response.error) {

                    console.error(
                        "Google OAuth Error:",
                        response
                    );

                    alert(
                        "Gagal menghubungkan Google Drive.\n\n" +
                        response.error
                    );

                    return;
                }


                googleAccessToken =
                    response.access_token;


                console.log(
                    "Google Access Token berhasil diterima."
                );


                alert(
                    "Google Drive berhasil terhubung! ✅"
                );

            }

        });


    console.log(
        "Google Drive OAuth siap ✅"
    );

}



// ==========================================
// HUBUNGKAN GOOGLE DRIVE
// ==========================================

function hubungkanGoogleDrive() {

    console.log(
        "Tombol Hubungkan Google Drive diklik."
    );


    // Kalau belum siap, coba inisialisasi lagi
    if (!googleTokenClient) {

        initGoogleDriveAuth();

    }


    if (!googleTokenClient) {

        alert(
            "Google Drive belum siap.\n\n" +
            "Coba refresh halaman."
        );

        return;
    }


    googleTokenClient.requestAccessToken({

        prompt: "consent"

    });

}


// ==========================================
// PASTIKAN BISA DIPANGGIL DARI HTML
// ==========================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;

window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;

window.buatFolderMyJourney =
    buatFolderMyJourney;
