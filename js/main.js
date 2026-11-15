(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');
    var posWrapHeader = $('.top-bar').length > 0 ? $('.top-bar').height() : 0;

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    } else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        } else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        });
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') {
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Filter / Search product panel toggle ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    });


    /*==================================================================
    [ Cart & Sidebar ]*/
    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });


    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });


    /*==================================================================
    [ Show / hide modal1 ]*/
    $('.js-hide-modal1').on('click',function(){
        $('.js-modal1').removeClass('show-modal1');
    });


    /*==================================================================
    [ Karsa Print Art - Koneksi Supabase, Filter & Pencarian ]*/
    const supabaseUrl = 'https://citfcbsciqcbjyplxfef.supabase.co';
    const supabaseKey = 'sb_publishable_ab9-Z2v-0mPDO4xDyVS26w_0jv6l7rX';
    const db = window.supabase.createClient(supabaseUrl, supabaseKey);

    let semuaProduk = [];
    let kategoriAktif = '*';
    let kataKunciCari = '';

    // Fungsi menyaring dan mencetak kartu block2 ke #katalog-container
    function renderKatalog() {
        const container = document.getElementById('katalog-container');
        if (!container) return;

        const katBersih = kategoriAktif.replace('.', '').toLowerCase();
        const cariBersih = kataKunciCari.trim().toLowerCase();

        const hasilFilter = semuaProduk.filter((item) => {
            const katItem = (item.kategori || '').toLowerCase();
            const cocokKategori = (katBersih === '*' || katItem === katBersih);

            const nama = (item.nama_produk || '').toLowerCase();
            const deskripsi = (item.deskripsi || '').toLowerCase();
            const cocokCari = (cariBersih === '' || nama.includes(cariBersih) || deskripsi.includes(cariBersih));

            return cocokKategori && cocokCari;
        });

        if (hasilFilter.length === 0) {
            container.innerHTML = `
                <div class="col-12 txt-center p-tb-40">
                    <p class="stext-107 cl6">Layanan atau produk yang dicari belum tersedia.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        hasilFilter.forEach((item) => {
            const hargaFormat = Number(item.harga_mulai).toLocaleString('id-ID');
            const gambar = item.gambar_url || 'images/product-01.jpg';

            container.innerHTML += `
                <div class="col-sm-6 col-md-4 col-lg-3 p-b-35">
                    <div class="block2">
                        <div class="block2-pic hov-img0">
                            <img src="${gambar}" alt="${item.nama_produk}">
                            <a href="#" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-detail-karsa" data-id="${item.id}">
                                Quick View
                            </a>
                        </div>

                        <div class="block2-txt flex-w flex-t p-t-14">
                            <div class="block2-txt-child1 flex-col-l">
                                <a href="#" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6 js-detail-karsa" data-id="${item.id}">
                                    ${item.nama_produk}
                                </a>
                                <span class="stext-105 cl3">
                                    Mulai Rp ${hargaFormat}
                                </span>
                            </div>

                            <div class="block2-txt-child2 flex-r p-t-3">
                                <span class="stext-109 cl6" style="text-transform: uppercase;">
                                    ${item.kategori || ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Ambil data awal dari tabel katalog_layanan
    async function muatKatalog() {
        const container = document.getElementById('katalog-container');
        const { data, error } = await db
            .from('katalog_layanan')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Gagal mengambil data:', error);
            container.innerHTML = '<div class="col-12"><p>Gagal memuat katalog layanan.</p></div>';
            return;
        }

        semuaProduk = data || [];
        renderKatalog();
    }

    // 1. Klik tombol kategori (Semua Layanan, Produk Karsa, Produk Cetak, Jasa Desain)
    $('.filter-tope-group').on('click', 'button', function () {
        $('.filter-tope-group button').removeClass('how-active1');
        $(this).addClass('how-active1');

        kategoriAktif = $(this).attr('data-filter');
        const namaTombol = $(this).text().trim();
        $('#judul-katalog').text(kategoriAktif === '*' ? 'Katalog Layanan' : namaTombol);

        renderKatalog();
    });

    // 2. Klik 3 Banner di atas untuk lompat dan menyaring kategori
    $('.js-banner-filter').on('click', function(e){
        e.preventDefault();
        
        var filterValue = $(this).attr('data-target');
        var newTitle = $(this).attr('data-title');

        kategoriAktif = filterValue;
        $('#judul-katalog').text(newTitle);

        $('.filter-tope-group button').removeClass('how-active1');
        $('.filter-tope-group button[data-filter="'+filterValue+'"]').addClass('how-active1');

        renderKatalog();

        $('html, body').animate({
            scrollTop: $('#katalog').offset().top - 70
        }, 800);
    });

    // 3. Pencarian langsung saat mengetik di kotak Search
    $(document).on('input', '#input-pencarian', function () {
        kataKunciCari = $(this).val();
        renderKatalog();
    });

    // 4. Buka Pop-up Quick View sesuai produk yang diklik
    $(document).on('click', '.js-detail-karsa', function (e) {
        e.preventDefault();
        const idProduk = $(this).data('id');
        const produk = semuaProduk.find((p) => p.id == idProduk);
        if (!produk) return;

        const hargaFormat = Number(produk.harga_mulai).toLocaleString('id-ID');
        $('.js-modal1 .js-name-detail').text(produk.nama_produk);
        $('.js-modal1 .mtext-106').text('Mulai Rp ' + hargaFormat);
        $('.js-modal1 .stext-102').text(produk.deskripsi || 'Konsultasikan kebutuhan visual Anda bersama Karsa Print Art.');
        
        if (produk.gambar_url) {
            $('.js-modal1 .gallery-lb img').attr('src', produk.gambar_url);
        }

        $('.js-modal1').addClass('show-modal1');
    });

    // Jalankan saat halaman selesai dimuat
    muatKatalog();

})(jQuery);