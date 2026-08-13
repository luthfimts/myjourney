const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";

const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";


let googleAccessToken = null;
let googleTokenClient = null;

// ==============================================
// SIAPKAN GOOGLE OAUTH
//===============================================

function initGoogleDriveAuth(){

    googleTokenClient =
        google.accounts.oayth2.initTokenClient({

            client_id: GOOGLE_CLIENT_ID,
            scope: GOOGLE_CLIENT_ID,
            callback: function(response){

                if (response.error){

                    console.error(
                        "Google OAuth Error:",
                        response
                    );

                    alert(
                        "Gagal menghubungkan Google Drive."
                    );
                    return;
                }

                googleAccessToken =
                    response.access_token;

                    console.log(
                        "Google  Drive berhasil terhubung."
                    );

                    alert(
                        "Google Drive berhasil terhubung! ✅"
                    );
            }
        });
}

// ===========================================================
// HUBUNGKAN GOOGLE DRIVE
// ===========================================================

function hubungkaanGoogleDrive(){

    if (!googleTokenClient){

        alert(
            "Google Drive belum siap."
        );

        return;
    }

    googleTokenClient.requestAccessToken({
        prompt: "consent"
    });
}