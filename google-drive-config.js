// ======================================================
// GOOGLE DRIVE - MYJOURNEY
// ======================================================

const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";

const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";

let googleTokenClient = null;
let googleAccessToken = null;


// ======================================================
// INIT GOOGLE
// ======================================================

function initGoogleDriveAuth() {

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

            client_id:
                GOOGLE_CLIENT_ID,

            scope:
                GOOGLE_DRIVE_SCOPE,

            callback:
                function(response) {

                    if (response.error) {

                        console.error(
                            "OAuth Error:",
                            response
                        );

                        alert(
                            "Login Google gagal."
                        );

                        return;
                    }


                    if (!response.access_token) {

                        alert(
                            "Access token Google tidak diterima."
                        );

                        return;
                    }


                    googleAccessToken =
                        response.access_token;


                    console.log(
                        "Token diterima:",
                        !!googleAccessToken
                    );

                    console.log(
                        "Panjang token:",
                        googleAccessToken.length
                    );


                    alert(
                        "Google Drive berhasil terhubung! ✅"
                    );

                }

        });


    console.log(
        "Google OAuth siap ✅"
    );

}



// ======================================================
// HUBUNGKAN GOOGLE DRIVE
// ======================================================

function hubungkanGoogleDrive() {

    if (!googleTokenClient) {

        initGoogleDriveAuth();

    }


    if (!googleTokenClient) {

        alert(
            "Google OAuth belum siap."
        );

        return;
    }


    googleTokenClient.requestAccessToken({
        prompt: "consent"
    });

}



// ======================================================
// BUAT FOLDER MYJOURNEY
// ======================================================

async function buatFolderMyJourney() {

    // ==========================================
    // PASTIKAN TOKEN ADA
    // ==========================================

    if (!googleAccessToken) {

        alert(
            "Google Drive belum terhubung.\n\n" +
            "Klik Hubungkan Google Drive terlebih dahulu."
        );

        return;

    }


    console.log(
        "Token tersedia sebelum API:",
        !!googleAccessToken
    );


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


        console.log(
            "Status Drive API:",
            response.status
        );


        console.log(
            "Response Drive:",
            data
        );


        if (!response.ok) {

            const pesan =
                data?.error?.message
                ||
                "Error tidak diketahui.";


            alert(

                "Gagal membuat folder MyJourney.\n\n"

                +

                pesan

            );


            return;

        }


        alert(
            "Folder MyJourney berhasil dibuat! 📁✅"
        );


        console.log(
            "Folder ID:",
            data.id
        );

    }

    catch(error) {

        console.error(
            "Fetch Error:",
            error
        );


        alert(
            "Tidak dapat menghubungi Google Drive API."
        );

    }

}



// ======================================================
// GLOBAL
// ======================================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;

window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;

window.buatFolderMyJourney =
    buatFolderMyJourney;
