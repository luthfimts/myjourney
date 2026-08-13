// ======================================================
// GOOGLE DRIVE CONFIG - MYJOURNEY
// ======================================================


// GANTI DENGAN CLIENT ID GOOGLE ANDA
const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com;


const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";


// ======================================================
// VARIABEL
// ======================================================

let googleTokenClient = null;

let googleAccessToken = null;

let googleTokenExpiresAt = 0;

let aksiSetelahLoginGoogle = null;

let googleFolderId = null;


// ======================================================
// INISIALISASI GOOGLE OAUTH
// ======================================================

function initGoogleDriveAuth() {

    console.log(
        "Menyiapkan Google Drive..."
    );


    if (
        typeof google === "undefined"
        ||
        !google.accounts
        ||
        !google.accounts.oauth2
    ) {

        console.error(
            "Google Identity Services belum tersedia."
        );

        return;
    }


    googleTokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id:
                GOOGLE_CLIENT_ID,

            scope:
                GOOGLE_DRIVE_SCOPE,


            callback:
                async function(response) {


                    // ==================================
                    // JIKA GOOGLE MENGEMBALIKAN ERROR
                    // ==================================

                    if (
                        response.error
                    ) {

                        console.error(
                            "Google OAuth Error:",
                            response
                        );


                        alert(
                            "Google Drive gagal dihubungkan.\n\n"
                            +
                            response.error
                        );


                        return;
                    }


                    // ==================================
                    // PASTIKAN ACCESS TOKEN ADA
                    // ==================================

                    if (
                        !response.access_token
                    ) {

                        console.error(
                            "Access token tidak ditemukan:",
                            response
                        );


                        alert(
                            "Google tidak memberikan access token."
                        );


                        return;
                    }


                    // ==================================
                    // CEK SCOPE DRIVE.FILE
                    // ==================================

                    const scopeDiberikan =
                        google.accounts.oauth2
                            .hasGrantedAllScopes(

                                response,

                                GOOGLE_DRIVE_SCOPE

                            );


                    if (
                        !scopeDiberikan
                    ) {

                        alert(
                            "Izin Google Drive belum diberikan."
                        );

                        return;
                    }


                    // ==================================
                    // SIMPAN TOKEN
                    // ==================================

                    googleAccessToken =
                        response.access_token;


                    // expires_in biasanya dalam detik

                    const expiresIn =
                        Number(
                            response.expires_in
                        )
                        ||
                        3600;


                    // kurangi 1 menit sebagai pengaman

                    googleTokenExpiresAt =
                        Date.now()
                        +
                        (
                            expiresIn
                            *
                            1000
                        )
                        -
                        60000;


                    console.log(
                        "Google OAuth berhasil."
                    );


                    // ==================================
                    // JALANKAN AKSI YANG TERTUNDA
                    // ==================================

                    if (
                        typeof aksiSetelahLoginGoogle
                        ===
                        "function"
                    ) {

                        const aksi =
                            aksiSetelahLoginGoogle;


                        aksiSetelahLoginGoogle =
                            null;


                        await aksi();

                    }

                }

        });


    console.log(
        "Google OAuth siap ✅"
    );

}



// ======================================================
// CEK TOKEN MASIH VALID
// ======================================================

function tokenGoogleMasihValid() {

    return (

        googleAccessToken

        &&

        Date.now()
        <
        googleTokenExpiresAt

    );

}



// ======================================================
// MINTA ACCESS TOKEN GOOGLE
// ======================================================

function mintaTokenGoogle(
    callback
) {

    if (
        !googleTokenClient
    ) {

        initGoogleDriveAuth();

    }


    if (
        !googleTokenClient
    ) {

        alert(
            "Google OAuth belum siap.\n\n"
            +
            "Refresh halaman lalu coba lagi."
        );

        return;
    }


    aksiSetelahLoginGoogle =
        callback;


    googleTokenClient
        .requestAccessToken({

            prompt:
                "consent"

        });

}



// ======================================================
// TOMBOL HUBUNGKAN GOOGLE DRIVE
// ======================================================

function hubungkanGoogleDrive() {


    // Jika token masih aktif

    if (
        tokenGoogleMasihValid()
    ) {

        alert(
            "Google Drive sudah terhubung! ✅"
        );

        return;
    }


    mintaTokenGoogle(

        async function() {

            alert(
                "Google Drive berhasil terhubung! ✅"
            );

        }

    );

}



// ======================================================
// BUAT FOLDER MYJOURNEY
// ======================================================

async function buatFolderMyJourney() {


    // ==========================================
    // TOKEN TIDAK ADA / SUDAH EXPIRED
    // ==========================================

    if (
        !tokenGoogleMasihValid()
    ) {


        console.log(
            "Meminta access token Google baru..."
        );


        mintaTokenGoogle(

            async function() {

                await buatFolderMyJourney();

            }

        );


        return;

    }



    console.log(
        "Membuat folder MyJourney..."
    );


    try {


        const response =
            await fetch(

                "https://www.googleapis.com/drive/v3/files?fields=id,name",

                {

                    method:
                        "POST",


                    headers: {

                        "Authorization":
                            "Bearer "
                            +
                            googleAccessToken,

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



        // ==========================================
        // API ERROR
        // ==========================================

        if (
            !response.ok
        ) {


            console.error(
                "Google Drive API Error:",
                data
            );


            const pesanError =

                data
                    ?.error
                    ?.message

                ||

                "Terjadi kesalahan yang tidak diketahui.";



            // Token ditolak Google
            if (
                response.status === 401
            ) {

                googleAccessToken =
                    null;

                googleTokenExpiresAt =
                    0;

            }


            alert(

                "Gagal membuat folder MyJourney.\n\n"

                +

                pesanError

            );


            return;

        }



        // ==========================================
        // BERHASIL
        // ==========================================

        googleFolderId =
            data.id;


        console.log(
            "Folder berhasil dibuat:",
            data.name,
            googleFolderId
        );


        alert(
            "Folder MyJourney berhasil dibuat di Google Drive! 📁"
        );


    }

    catch(error) {


        console.error(
            "Error:",
            error
        );


        alert(
            "Terjadi kesalahan saat menghubungi Google Drive."
        );

    }

}



// ======================================================
// SUPAYA FUNGSI BISA DIPANGGIL DARI HTML
// ======================================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;

window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;

window.buatFolderMyJourney =
    buatFolderMyJourney;
