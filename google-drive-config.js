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


// ==========================================
// UPLOAD FILE KE GOOGLE DRIVE
// ==========================================

async function uploadFileKeGoogleDrive(file){

    if (!googleAccessToken){

        alert(
            "Google Drive belum terhubung."
        )

        return null;
    }

    if (!googleFolderId){
        alert(
            "Folder MyJourney belum siap."
        );

        return null;
    }

    if (!file){
        alert(
            "File belum dipilih."
        );

        return null;
    }

    try {

        // ==================================   
        //  METADATA FILE
        // ==================================

        const metadata = {
                name:
                    Date.now()
                    +
                    "-"
                    +
                    file.name,

                parent: [
                    googleFolderId
                ]
            };


          // ================================
          // MULTIPART FORM
          // ================================

          const form =
          new formatData();

          form.append(

            "metadata",
            new Blob(
                [
                    JSON.stringify(
                        metadata
                    )
                ],
                    {
                        type:
                            "application/json"
                    }
            )
          );

          form.append(
            "file",
            file
          );

          // =========================================
          // UPLOAD
          // =========================================

          const response =
            await fetch(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size",

                {
                    method:
                        "POST",

                    headers: {
                        "Authorization":
                        'Bearer ${googleAccessToken}'
                    },

                    body:
                     form
                }
            );

            const data =
            await response.json();

            if (!response.ok){
                console.error(
                    "Upload Drive Error",
                    data
                );

                alert(
                    "Upload foto gagal.\n\n"

                    *
                    (
                        data?.error?.message
                        ||
                        "Error tidak diketahui."
                    )
                );

                return null;
            }

            console.log(
                 "Upload berhasil:",
            data

            );

            alert(
                 "Foto berhasil diupload ke Google Drive! 📸✅"
            );

            return data;
           
        }

        catch(error){
            console.error(
                "Upload error:",
                error
            );

            alert(
                "Terjadi kesalahan saat upload ke Google Drive"
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
