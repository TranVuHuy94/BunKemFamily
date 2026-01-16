# Design Rules for BunKemFamily

## Core Principle
"Kỷ niệm là độc nhất" (Memories are unique). Do đó, mỗi thẻ kỷ niệm trên trang chủ PHẢI có một nhận diện riêng biệt.

## Event Card Guidelines

Mọi card mới thêm vào `index.html` cần tuân thủ cấu trúc sau:

1. **Unique Theme**: Mỗi card phải có một cặp màu gradient chủ đạo riêng.
2. **Interactive Hover**: Khi di chuột vào, card phải có phản hồi thị giác (scale, glow, hoặc icon animation).
3. **Tailwind Styling**: Sử dụng Tailwind CSS classes.

### Current Themes

| Event | Color Theme | Hover Effect | Emoji/Icon |
|-------|-------------|--------------|------------|
| **The Birth** (Chào đời) | Rose/Pink (`from-rose-100 to-pink-200`) | Pulse + Heartbeat | 👶 / 🌸 |
| **The Letter** (Thư) | Slate/Blue (`from-slate-100 to-blue-200`) | Tilt + Paper Plane | 💌 / 📝 |
| **1 Month** (Đầy tháng) | Amber/Yellow (`from-amber-100 to-yellow-200`) | Scale + Sparkles | 🎂 / ⭐ |
| **Coming Soon** | Gray/Zinc (`from-gray-100 to-zinc-200`) | Grayscale to Color | 📸 |

## Background
- Trang chủ (`index.html`) sử dụng **Interactive Particle Background**.
- Không dùng ảnh nền tĩnh gây nhàm chán.
- Effect phải tinh tế, màu sắc nhẹ nhàng (Pastel/Light), không làm khó đọc text.

## Typography
- Tiêu đề: `font-display` (Baloo 2 hoặc Playfair Display).
- Nội dung: `font-body` (Quicksand hoặc Inter).
