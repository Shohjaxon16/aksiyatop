# Aksiya Top: Ishga tushirish va Deploy qilish bo'yicha qo'llanma

Tabriklaymiz! "Aksiya Top" startapingizning birinchi versiyasi tayyor. Quyida uni qanday ishlatish va ommaga taqdim etish haqida ma'lumot berilgan.

## 1. Local (Kompyuterda) ishga tushirish
1. `START_UP` papkasini oching.
2. `index.html` faylini istalgan brauzerda (Chrome, Safari, Firefox) oching.
3. Hozircha barcha ma'lumotlar brauzerning `localStorage` xotirasida saqlanadi. Ya'ni, siz qo'shgan aksiyalar faqat sizning kompyuteringizda ko'rinadi.

## 2. Google Maps API ni sozlash
Xarita ishlashi uchun sizga Google Maps API Key kerak bo'ladi:
1. [Google Cloud Console](https://console.cloud.google.com/)'ga kiring.
2. Yangi loyiha yarating va "Maps JavaScript API"ni yoqing.
3. "Credentials" bo'limidan **API Key** oling.
4. `index.html` faylining oxiridagi `YOUR_API_KEY` o'rniga o'sha kalitni qo'ying.

## 3. Google Xaritalar Xatoligi (Troubleshooting)
Agar sizda "Bu sahifa Google Xaritalarni noto‘g‘ri yukladi" degan xatolik chiqsa:
- Bu API Key yo'qligini yoki noto'g'riligini bildiradi.
- `index.html` faylini oching.
- Eng tagiga tushing va `YOUR_API_KEY` degan yozuvni o'z kalitingizga almashtiring.
- Google Cloud-da "Maps JavaScript API" yoqilganiga ishonch hosil qiling.

## 4. Google'da ko'rinishi (SEO)
Hozircha sayt faqat Front-end qismidan iborat. Kelajakda ma'lumotlarni barcha foydalanuvchilar ko'rishi uchun quyidagilarni qilish kerak:
- **Firebase** yoki **Node.js + MongoDB** yordamida ma'lumotlar omborini ulash.
- Foydalanuvchilarni ro'yxatdan o'tkazish (Optional).

## 5. Deploy qilish (Internetga joylash)
Saytni bepul va oson joylash uchun quyidagi servislardan foydalanishni tavsiya qilaman:
- **Vercel** yoki **Netlify**: Shunchaki papkani tashlasangiz, sizga link beradi.
- **GitHub Pages**: Kodni GitHub'ga yuklasangiz, tekinga hosting beradi.

---
Agar savollaringiz bo'lsa, har doim yordamga tayyorman! Omad! 🚀
