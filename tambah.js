// ==========================================
// CEK LOGIN SUPABASE
// ==========================================

async function cekLogin() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Gagal mengecek login:",
            error
        );

        window.location.href =
            "index.html";

        return;
    }


    if (
        !data.session
    ) {

        window.location.href =
            "index.html";

        return;
    }


    console.log(
        "User login:",
        data.session.user.email
    );

}


cekLogin();

// ==========================================
// FORM TAMBAH PERJALANAN
// ==========================================

document
    .getElementById(
        "journeyForm"
    )
    .addEventListener(

        "submit",

        function(event) {


            event.preventDefault();



            // ==============================
            // AMBIL DATA FORM
            // ==============================

            const namaTempat =

                document
                    .getElementById(
                        "namaTempat"
                    )
                    .value
                    .trim();



            const tanggal =

                document
                    .getElementById(
                        "tanggal"
                    )
                    .value;



            const kota =

                document
                    .getElementById(
                        "kota"
                    )
                    .value
                    .trim();



            const provinsi =

                document
                    .getElementById(
                        "provinsi"
                    )
                    .value
                    .trim();



            const negara =

                document
                    .getElementById(
                        "negara"
                    )
                    .value
                    .trim();



            const catatan =

                document
                    .getElementById(
                        "catatan"
                    )
                    .value
                    .trim();



            // ==============================
            // VALIDASI
            // ==============================

            if (
                namaTempat === ""
                ||
                tanggal === ""
                ||
                kota === ""
                ||
                provinsi === ""
                ||
                negara === ""
            ) {


                alert(

                    "Mohon lengkapi semua data perjalanan."

                );


                return;

            }



            // ==============================
            // BUAT DATA PERJALANAN
            // ==============================

            const perjalananBaru = {


                id:
                    Date.now(),


                namaTempat:
                    namaTempat,


                tanggal:
                    tanggal,


                kota:
                    kota,


                provinsi:
                    provinsi,


                negara:
                    negara,


                catatan:
                    catatan,
                
             

            };



            // ==============================
            // AMBIL DATA LAMA
            // ==============================

            let daftarPerjalanan =

                JSON.parse(

                    localStorage.getItem(
                        "daftarPerjalanan"
                    )

                ) || [];



            // ==============================
            // TAMBAHKAN DATA
            // ==============================

            daftarPerjalanan.push(
                perjalananBaru
            );



            // ==============================
            // SIMPAN KE LOCAL STORAGE
            // ==============================

            localStorage.setItem(

                "daftarPerjalanan",

                JSON.stringify(
                    daftarPerjalanan
                )

            );



            // ==============================
            // NOTIFIKASI
            // ==============================

            alert(

                "Perjalanan berhasil disimpan!"

            );



            // ==============================
            // KEMBALI KE DASHBOARD
            // ==============================

            window.location.href =
                "dashboard.html";


        }

    );
