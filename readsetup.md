# Panduan Setup datagovmy-front

Dokumen ini menerangkan cara menyediakan dan menjalankan projek `datagovmy-front` secara tempatan.

## 1. Keperluan

Pastikan perisian berikut tersedia:

- Git
- Node.js 20 atau lebih baharu
- Corepack

Semak versi:

```bash
node --version
corepack --version
```

Projek ini ialah monorepo Turborepo dan menggunakan Yarn `1.22.19`. Gunakan arahan `corepack yarn` supaya versi Yarn mengikut nilai `packageManager` dalam `package.json`.

## 2. Clone dan Pasang Dependency

```bash
git clone git@github.com:data-gov-my/datagovmy-front.git
cd datagovmy-front
corepack yarn install
corepack yarn prepare
```

Jangan campurkan `npm install` dengan `yarn install`. Repo menggunakan `yarn.lock`; penggunaan dua package manager boleh menghasilkan dependency tree yang berbeza.

## 3. Struktur Workspace

Workspace utama ialah:

| Workspace | Kegunaan                            | Port lalai |
| --------- | ----------------------------------- | ---------- |
| `app`     | Portal utama data.gov.my            | `3000`     |
| `dc-dev`  | Aplikasi pembangunan data catalogue | `3000`     |
| `docs`    | Dokumentasi                         | `3001`     |

`app` dan `dc-dev` menggunakan port lalai yang sama. Jalankan salah satu sahaja pada satu-satu masa, atau berikan port lain melalui argumen Next.js.

## 4. Environment Variables

Salin fail contoh untuk workspace yang hendak dijalankan:

```bash
# Portal utama
cp apps/app/.env.example apps/app/.env

# Data catalogue development
cp apps/dc-dev/.env.example apps/dc-dev/.env

# Dokumentasi
cp apps/docs/.env.example apps/docs/.env
```

Untuk `app`, pemboleh ubah backend yang paling penting ialah:

```dotenv
APP_URL=http://localhost:3000
APP_ENV=development
NEXT_PUBLIC_APP_URL=$APP_URL
NEXT_PUBLIC_APP_ENV=$APP_ENV
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTHORIZATION_TOKEN=
NEXT_PUBLIC_I18N_URL=https://dlz3uh7rpztx1.cloudfront.net
```

Dapatkan nilai sebenar `NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_AUTHORIZATION_TOKEN` daripada pemilik backend atau konfigurasi deployment. Pemboleh ubah Tinybird, Mixpanel, Google Analytics, GitHub OAuth dan tileserver adalah berdasarkan fungsi yang digunakan. Jangan commit fail `.env` atau secret ke Git.

## 5. Jalankan Development Server

Jalankan portal utama sahaja:

```bash
corepack yarn workspace app dev
```

Jalankan `dc-dev` sahaja:

```bash
corepack yarn workspace dc-dev dev
```

Jalankan dokumentasi sahaja:

```bash
corepack yarn workspace docs dev
```

Arahan berikut dijalankan dari root tetapi boleh memulakan semua workspace yang mempunyai skrip `dev`:

```bash
corepack yarn dev
```

Oleh itu, untuk kerja harian gunakan arahan `workspace` supaya hanya aplikasi yang diperlukan dijalankan.

## 6. Build dan Semakan

Build workspace tertentu:

```bash
corepack yarn workspace app build
corepack yarn workspace dc-dev build
corepack yarn workspace docs build
```

Build melalui Turbo dengan filter:

```bash
corepack yarn build --filter=app
corepack yarn build --filter=dc-dev
```

Jalankan lint seluruh monorepo:

```bash
corepack yarn lint
```

Format fail TypeScript, Markdown dan fail berkaitan:

```bash
corepack yarn format
```

## 7. Deployment Vercel

Untuk deployment workspace tertentu, tetapkan perkara berikut dalam Vercel:

- Root directory: root repository
- Install command: `corepack yarn install --frozen-lockfile`
- Build command: `corepack yarn build --filter=<workspace>`
- Output directory: `apps/<workspace>/.next`
- Node.js: versi 20 atau lebih baharu

Contoh build untuk `dc-dev`:

```bash
corepack yarn build --filter=dc-dev
```

Tambahkan semua environment variables yang diperlukan melalui Vercel Project Settings. Jangan masukkan secret terus ke dalam source code.

## 8. Troubleshooting

### `yarn: command not found`

Gunakan Yarn melalui Corepack:

```bash
corepack yarn --version
corepack yarn workspace app dev
```

### Port 3000 telah digunakan

Tutup proses lama atau jalankan aplikasi pada port lain:

```bash
corepack yarn workspace app dev --port 3002
```

### API gagal atau halaman tiada data

Semak nilai berikut dalam fail `.env` workspace:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AUTHORIZATION_TOKEN`
- `NEXT_PUBLIC_APP_ENV`

Selepas mengubah `.env`, hentikan dan mulakan semula development server.

### `caniuse-lite is outdated`

Ini biasanya amaran dan bukan punca build gagal. Kemas kini pangkalan data Browserslist dengan:

```bash
corepack yarn dlx update-browserslist-db@latest
```

Semak perubahan pada `yarn.lock` sebelum commit.

### Bersihkan cache Next.js dan Turbo

Jika build menggunakan cache lama, pindahkan folder `.next` dan `.turbo` keluar daripada repo atau padam hanya selepas memastikan tiada data penting di dalamnya. Kemudian pasang dependency dan jalankan build semula.

## 9. Aliran Kerja Ringkas

```bash
git pull
corepack yarn install --frozen-lockfile
cp apps/app/.env.example apps/app/.env
# Isi konfigurasi backend dalam apps/app/.env
corepack yarn workspace app dev
```

Akses portal melalui [http://localhost:3000](http://localhost:3000).
