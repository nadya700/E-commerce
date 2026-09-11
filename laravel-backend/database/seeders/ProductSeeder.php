<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'id' => 1,
                'name' => 'Kral Mavi Yun Palto',
                'slug' => 'kral-mavi-yun-palto',
                'category' => 'Pencək',
                'gender' => 'Qadın',
                'price' => 189.99,
                'original_price' => 249.99,
                'description' => 'Zərif kəsimli, 100% təbii İtalyan yunundan hazırlanmış kral mavi uzun qış paltosu. Kəmərli beli və atlas astarı ilə zərifliyi tamamlayır.',
                'composition' => '80% Yun, 20% Kaşmir, Atlas astar',
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => [
                    ['name' => 'Kral Mavisi', 'hex' => '#1e40af'],
                    ['name' => 'Gecə Göyü', 'hex' => '#0f172a']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 14,
                'rating' => 4.9,
                'reviews_count' => 38,
                'is_featured' => true,
                'tags' => ['palto', 'yun', 'premium', 'qış']
            ],
            [
                'id' => 2,
                'name' => 'Kobalt Pambıq Oksford Köynək',
                'slug' => 'kobalt-pambiq-oksford-koynek',
                'category' => 'Köynək',
                'gender' => 'Kişi',
                'price' => 65.00,
                'original_price' => 85.00,
                'description' => 'Nəfəsalan Misir pambığından toxunmuş, qırışmaya davamlı canlı kobalt mavisi klassik köynək. Həm ofis, həm də gündəlik üslub üçün idealdır.',
                'composition' => '100% Premium Oksford Pambığı',
                'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
                'colors' => [
                    ['name' => 'Kobalt Mavi', 'hex' => '#2563eb'],
                    ['name' => 'Açıq Göy', 'hex' => '#60a5fa']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 28,
                'rating' => 4.8,
                'reviews_count' => 52,
                'is_featured' => true,
                'tags' => ['köynək', 'pambıq', 'oksford', 'klassik']
            ],
            [
                'id' => 3,
                'name' => 'Safir İpək Ziyafət Donu',
                'slug' => 'safir-ipek-ziyafet-donu',
                'category' => 'Don',
                'gender' => 'Qadın',
                'price' => 145.00,
                'original_price' => null,
                'description' => 'Axıcı təbii ipək parça, zərif kürək dekoltesi və safir çalarları ilə xüsusi gecələriniz üçün unudulmaz obraz.',
                'composition' => '100% Təbii İpək',
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => [
                    ['name' => 'Safir Mavisi', 'hex' => '#1d4ed8'],
                    ['name' => 'Dəniz Mavisi', 'hex' => '#0284c7']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 9,
                'rating' => 5.0,
                'reviews_count' => 19,
                'is_featured' => true,
                'tags' => ['don', 'ipək', 'ziyafət', 'safir']
            ],
            [
                'id' => 4,
                'name' => 'İndiqo Düz Kəsim Denim Şalvar',
                'slug' => 'indiqo-duz-kesim-denim-salvar',
                'category' => 'Şalvar',
                'gender' => 'Uniseks',
                'price' => 79.50,
                'original_price' => 99.00,
                'description' => 'Klassik yapon denim ənənələrinə uyğun, ağır çəkili təmiz pambıq indiqo mavi cins şalvar. Uzunömürlü tikişlər və rahat düz biçim.',
                'composition' => '98% Pambıq, 2% Elastan',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'İndiqo Mavisi', 'hex' => '#312e81'],
                    ['name' => 'Yuyulmuş Mavi', 'hex' => '#3b82f6']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 35,
                'rating' => 4.7,
                'reviews_count' => 41,
                'is_featured' => false,
                'tags' => ['denim', 'cins', 'şalvar', 'indiqo']
            ],
            [
                'id' => 5,
                'name' => 'Buz Mavisi Kaşmir Sviter',
                'slug' => 'buz-mavisi-kasmir-sviter',
                'category' => 'Sviter',
                'gender' => 'Qadın',
                'price' => 110.00,
                'original_price' => 135.00,
                'description' => 'Yumşaq toxunuşlu, istilik saxlayan və nəfis buz mavisi rəng tonuna malik zərif boğazlı kaşmir jaket.',
                'composition' => '100% Monqol Kaşmiri',
                'sizes' => ['XS', 'S', 'M', 'L'],
                'colors' => [
                    ['name' => 'Buz Mavisi', 'hex' => '#93c5fd'],
                    ['name' => 'Pastel Göy', 'hex' => '#bfdbfe']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 18,
                'rating' => 4.9,
                'reviews_count' => 27,
                'is_featured' => true,
                'tags' => ['sviter', 'kaşmir', 'isti', 'buz mavisi']
            ],
            [
                'id' => 6,
                'name' => 'Dənizçi Mavisi Zomş Lofer',
                'slug' => 'denizci-mavisi-zoms-lofer',
                'category' => 'Ayaqqabı',
                'gender' => 'Kişi',
                'price' => 130.00,
                'original_price' => 160.00,
                'description' => 'Əl işi təbii dana zomşundan hazırlanmış, çevik altlıqlı dərin dənizçi mavisi rahat premium lofer ayaqqabı.',
                'composition' => '100% Təbii Zomş Dəri, Rezin daban',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Dənizçi Mavisi', 'hex' => '#1e3a8a'],
                    ['name' => 'Göyərçin Mavisi', 'hex' => '#3b82f6']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 11,
                'rating' => 4.6,
                'reviews_count' => 15,
                'is_featured' => false,
                'tags' => ['lofer', 'ayaqqabı', 'zomş', 'kişi']
            ],
            [
                'id' => 7,
                'name' => 'Piknik Göyü Zolaqlı Kətan Köynək',
                'slug' => 'piknik-goyu-zolaqli-ketan-koynek',
                'category' => 'Köynək',
                'gender' => 'Uniseks',
                'price' => 55.00,
                'original_price' => null,
                'description' => 'Yay fəsli üçün sərinləşdirici 100% təbii kətan parça, mavi-ağ incə zolaqlı dizayn və rahat oversize kəsim.',
                'composition' => '100% Fransız Kətanı',
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => [
                    ['name' => 'Göy Zolaqlı', 'hex' => '#38bdf8'],
                    ['name' => 'Açıq Mavi', 'hex' => '#7dd3fc']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 22,
                'rating' => 4.8,
                'reviews_count' => 31,
                'is_featured' => false,
                'tags' => ['kətan', 'köynək', 'yay', 'zolaqlı']
            ],
            [
                'id' => 8,
                'name' => 'Kral Mavi İpək Boyun Şərfi',
                'slug' => 'kral-mavi-ipek-boyun-serfi',
                'category' => 'Aksessuar',
                'gender' => 'Qadın',
                'price' => 35.00,
                'original_price' => 45.00,
                'description' => 'Həndəsi mavi naxışlarla bəzədilmiş, əl ilə kənarları toxunmuş lüks ipək qadın yaylığı və boyun şərfi.',
                'composition' => '100% Tvil İpək',
                'sizes' => ['M'],
                'colors' => [
                    ['name' => 'Kral Mavisi', 'hex' => '#1e40af'],
                    ['name' => 'Elektrik Mavi', 'hex' => '#0ea5e9']
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop'
                ],
                'stock' => 40,
                'rating' => 4.9,
                'reviews_count' => 64,
                'is_featured' => true,
                'tags' => ['şərf', 'aksessuar', 'ipək', 'mavi']
            ]
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['id' => $p['id']], $p);
        }
    }
}
