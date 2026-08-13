const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";

const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";

let googleAccessToken = null;
let googleTokenClient = null;
let googleFolderId = null;

// =========================================
// BUAT FOLDER MYJOURNEY DI GOOGLE DRIVE
// =========================================

async function buatFolderMyJourney() {
    
    if (!googleAccessToken){

        alert(
            "Google Drive belum terhubung."
        );

        return;
    }

    try{
        const response =
        await fetch(
            "https://www.googleapis.com/drive/v3/files?fields=id,name",
            {
                method: "POST",
                headers: {
                    "Authorization":
                    "Bearer" + googleAccessToken,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    name: 
                    "MyJourney",
                    nimeType:
                    "application/vnd.google-apps.folder" 
                })
            }
        );

        const data=
            await response.json();

        if (!response.ok){

            console.error(
                "Gagal membuat folder:",
                data
            );

            alert(
                "Gagal membuat folder MyJourney."
            );

            return;
        }

        googleFolderId =
            data.id;

        console.log(
            "Folder MyJourney berhasil dibuat:",
            googleFolderId
        );

        alert(
            "Folder MyJourney berhasil dibuat di Google Drive! 📁"
        );
    }

    catch(error){

        console.error(
            "Error membuat folder:",
            error
        );

        alert(
            "Terjadi kesalahan saat membuat folder."
        );
    }
}

window.buatFolderMyJourney =
    buatFolderMyJourney;

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
