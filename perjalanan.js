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

// ===============================
// AMBIL DATA
// ===============================

let daftarPerjalanan =

    JSON.parse(
        localStorage.getItem(
            "daftarPerjalanan"
        )
    ) || [];


const journeyGrid =
    document.getElementById(
        "journeyGrid"
    );


// ===============================
// TAMPILKAN DATA
// ===============================

function tampilkanPerjalanan(data) {

    journeyGrid.innerHTML = "";


    // Jika belum ada data

    if (data.length === 0) {

        journeyGrid.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🧳
                </div>

                <h2>
                    Belum ada perjalanan
                </h2>

                <p>
                    Tambahkan tempat pertama
                    yang sudah pernah kamu kunjungi.
                </p>

                <button
                    class="add-btn"
                    onclick="window.location.href='tambah.html'">

                    + Tambah Perjalanan

                </button>

            </div>

        `;

        return;
    }


    // Urutkan terbaru

    const dataTerbaru = [
        ...data
    ].reverse();


    dataTerbaru.forEach(
        function(item) {


            const tanggal =
                new Date(
                    item.tanggal
                );


            const tanggalIndonesia =

                tanggal.toLocaleDateString(

                    "id-ID",

                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }

                );


            journeyGrid.innerHTML += `

                <div class="journey-card">


                    <div class="card-cover">

                        📍

                    </div>


                    <div class="card-body">

                        <h3>
                            ${item.namaTempat}
                        </h3>


                        <p class="location">

                            🏙️ ${item.kota},
                            ${item.provinsi}

                        </p>


                        <p class="location">

                            🌏 ${item.negara}

                        </p>


                        <p class="date">

                            📅 ${tanggalIndonesia}

                        </p>


                        <p class="notes">

                            ${
                                item.catatan
                                ?
                                item.catatan
                                :
                                "Tidak ada catatan perjalanan."
                            }

                        </p>


                        <div class="card-actions">

                            <button
                                class="detail-btn"
                                onclick="lihatDetail(${item.id})">

                                Lihat Detail

                            </button>


                            <button
                                class="delete-btn"
                                onclick="hapusPerjalanan(${item.id})">

                                Hapus

                            </button>

                        </div>


                    </div>


                </div>

            `;

        });

}


tampilkanPerjalanan(
    daftarPerjalanan
);


// ===============================
// PENCARIAN
// ===============================

const searchInput =
    document.getElementById(
        "searchInput"
    );


searchInput.addEventListener(
    "input",
    function() {


        const keyword =
            searchInput.value
                .toLowerCase();


        const hasil =

            daftarPerjalanan.filter(

                function(item) {


                    return (

                        item.namaTempat
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        item.kota
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        item.provinsi
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        item.negara
                            .toLowerCase()
                            .includes(keyword)

                    );

                }

            );


        tampilkanPerjalanan(
            hasil
        );

    }
);


// ===============================
// HAPUS
// ===============================

function hapusPerjalanan(id) {


    const yakin =
        confirm(
            "Apakah kamu yakin ingin menghapus perjalanan ini?"
        );


    if (!yakin) {

        return;

    }


    daftarPerjalanan =

        daftarPerjalanan.filter(

            function(item) {

                return item.id !== id;

            }

        );


    localStorage.setItem(

        "daftarPerjalanan",

        JSON.stringify(
            daftarPerjalanan
        )

    );


    tampilkanPerjalanan(
        daftarPerjalanan
    );

}


// ===============================
// DETAIL
// ===============================

function lihatDetail(id) {


    const perjalanan =

        daftarPerjalanan.find(

            function(item) {

                return item.id === id;

            }

        );


    if (!perjalanan) {

        return;

    }


    alert(

        "Nama Tempat: "
        + perjalanan.namaTempat

        + "\n\nKota: "
        + perjalanan.kota

        + "\nProvinsi: "
        + perjalanan.provinsi

        + "\nNegara: "
        + perjalanan.negara

        + "\nTanggal: "
        + perjalanan.tanggal

        + "\n\nCatatan:\n"
        + (
            perjalanan.catatan
            ||
            "Tidak ada catatan."
        )

    );

}


// ===============================
// LOGOUT
// ===============================
async function logout() {

    const {
        error
    } =
        await supabaseClient
            .auth
            .signOut();


    if (error) {

        console.error(
            "Logout gagal:",
            error
        );

        return;
    }


    window.location.href =
        "index.html";

}