import { SectionType } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "~/config/prisma";

async function seed() {
  return await prisma.article.create({
    data: {
      slug: "html-dasar",
      title: "HTML Dasar",
      published: true,
      category: "Programming",
      view: 0,
      topics: ["HTML", "Web Development", "Programming"],
      sections: {
        createMany: {
          data: [
            {
              content:
                "HTML adalah bahasa markup standar untuk membuat halaman web.",
              type: SectionType.H1,
            },
            {
              content:
                "Pada artikel ini, kita akan mempelajari dasar-dasar HTML.",
              type: SectionType.H2,
            },
            {
              content:
                "HTML memiliki berbagai elemen seperti <div>, <p>, <a>, dll.",
              type: SectionType.H3,
            },
            {
              content:
                "Tag HTML adalah dasar dari struktur sebuah halaman web.",
              type: SectionType.H4,
            },
            {
              content:
                "HTML juga dapat digunakan untuk membuat form, tabel, dan lainnya.",
              type: SectionType.H5,
            },
            {
              content:
                "Untuk menampilkan gambar, kita dapat menggunakan tag <img>.",
              type: SectionType.H6,
            },
            {
              content: "Ini adalah contoh teks biasa dalam HTML.",
              type: SectionType.Text,
            },
            {
              content:
                "https://res.cloudinary.com/dga0wmldp/image/upload/v1740217904/socio/article/GeYZzh0WcAAM8Yo_iuhrsi.jpg",
              type: SectionType.Image,
            },
            {
              content:
                'HTML mempermudah pengembangan web secara signifikan.',
              type: SectionType.Quote,
            },
            {
              content:
                "Menyusun struktur dasar HTML\nMenambahkan elemen-elemen HTML\nMembuat halaman web yang fungsional",
              type: SectionType.List,
            },
            {
              content: "<html>\n<head>\n<body>",
              type: SectionType.Number,
            },
          ],
        },
      },
    },
  });
}

async function seed2() {
  return await prisma.article.create({
    data: {
      slug: "react-js",
      title: "Panduan Lengkap Mengenai React.js",
      published: true,
      category: "Programming",
      view: 0,
      topics: ["React", "JavaScript", "Web Development"],
      sections: {
        createMany: {
          data: [
            // H1 - Apa itu React?
            {
              content: "Apa itu React?",
              type: SectionType.H1,
            },
            // P - Penjelasan tentang React
            {
              content:
                "React adalah library JavaScript yang digunakan untuk membangun antarmuka pengguna (UI) yang dinamis dan efisien. React memungkinkan Anda untuk membuat aplikasi web yang interaktif dengan cara yang lebih terstruktur dan mudah dipelajari.",
              type: SectionType.Text,
            },
            // Image
            {
              content:
                "https://res.cloudinary.com/dga0wmldp/image/upload/v1740217904/socio/article/GeYZzh0WcAAM8Yo_iuhrsi.jpg",
              type: SectionType.Image,
            },
            // H2 - Sejarah
            {
              content: "Sejarah",
              type: SectionType.H2,
            },
            // P - Penjelasan Sejarah
            {
              content:
                "React pertama kali dikembangkan oleh Jordan Walke, seorang engineer di Facebook, pada tahun 2011. Versi publik pertama dirilis pada tahun 2013, dan sejak saat itu React berkembang pesat hingga menjadi framework paling populer di dunia untuk pengembangan aplikasi web.",
              type: SectionType.Text,
            },
            // H3 - Profile Penemu
            {
              content: "Profile Penemu",
              type: SectionType.H3,
            },
            // P - Tentang Jordan Walke
            {
              content:
                "Jordan Walke adalah seorang engineer perangkat lunak yang bekerja di Facebook dan merupakan pencipta React. Ia menciptakan React untuk mengatasi tantangan yang dihadapi oleh pengembang dalam membangun aplikasi web yang dinamis dan cepat.",
              type: SectionType.Text,
            },
            // Quote - Dari Penemu
            {
              content:
                'Saya ingin membuat sesuatu yang lebih efisien dan dapat digunakan dalam aplikasi web besar.',
              type: SectionType.Quote,
            },
            // H4 - Digunakan oleh Industri Besar
            {
              content: "Digunakan oleh Industri Besar",
              type: SectionType.H4,
            },
            // Number - Pengguna React di Industri Besar
            {
              content:
                "Facebook\nInstagram\nAirbnb\nNetflix\nUber",
              type: SectionType.Number,
            },
            // H4 - Versi React
            {
              content: "Versi React",
              type: SectionType.H4,
            },
            // List - Versi React yang Penting
            {
              content:
                "React 0.3.0 - Versi pertama dirilis\nReact 16.0 - Mendukung Fragment dan Portals\nReact 17.0 - Penyempurnaan ReactDOM",
              type: SectionType.List,
            },
            // H2 - Reactive
            {
              content: "Reactive",
              type: SectionType.H2,
            },
            // P - Penjelasan tentang Reactive
            {
              content:
                "React menggunakan paradigma pemrograman reaktif, yang berarti UI akan otomatis terupdate setiap kali data berubah. Dengan menggunakan virtual DOM, React dapat memperbarui hanya bagian yang diperlukan, sehingga aplikasi lebih efisien.",
              type: SectionType.Text,
            },
            // H2 - Perbedaan dengan JavaScript Murni DOM
            {
              content: "Perbedaan dengan JavaScript Murni DOM",
              type: SectionType.H2,
            },
            // Image
            {
              content:
                "https://res.cloudinary.com/dga0wmldp/image/upload/v1740217904/socio/article/GeYZzh0WcAAM8Yo_iuhrsi.jpg",
              type: SectionType.Image,
            },
            // P - Penjelasan Perbedaan
            {
              content:
                "Pada JavaScript murni, setiap perubahan pada DOM akan langsung mempengaruhi halaman web secara keseluruhan. Sementara itu, React hanya memperbarui bagian UI yang berubah dengan menggunakan virtual DOM, yang membuatnya lebih cepat dan efisien.",
              type: SectionType.Text,
            },
            // H1 - Dasar React
            {
              content: "Dasar React",
              type: SectionType.H1,
            },
            // P - Penjelasan Dasar React
            {
              content:
                "React.js adalah library JavaScript untuk membangun antarmuka pengguna (UI) interaktif. React memungkinkan Anda untuk membuat aplikasi web yang cepat dan dinamis dengan menggunakan komponen yang dapat dipakai ulang.",
              type: SectionType.Text,
            },
            // List - Dasar yang Sering Digunakan dalam React
            {
              content:
                "Komponen\nJSX\nProps\nState\nEvent Handling\nReact Router",
              type: SectionType.List,
            },
            // H2 - Hooks
            {
              content: "Hooks",
              type: SectionType.H2,
            },
            // P - Penjelasan tentang Hooks
            {
              content:
                "Hooks adalah fitur baru di React yang memungkinkan Anda menggunakan state dan fitur React lainnya tanpa menulis kelas. Hooks membuat kode lebih bersih dan mudah dipahami.",
              type: SectionType.Text,
            },
            // H3 - useState
            {
              content: "useState",
              type: SectionType.H3,
            },
            // P - Penjelasan tentang useState
            {
              content:
                "useState adalah hook yang memungkinkan Anda untuk menambahkan state ke dalam komponen fungsional. Dengan hook ini, Anda dapat memanipulasi nilai state dan memicu render ulang komponen saat nilai state berubah.",
              type: SectionType.Text,
            },
            // H3 - useEffect
            {
              content: "useEffect",
              type: SectionType.H3,
            },
            // P - Penjelasan tentang useEffect
            {
              content:
                "useEffect adalah hook yang digunakan untuk melakukan side effects dalam komponen fungsional, seperti pengambilan data dari API atau manipulasi DOM secara langsung. Hook ini menggantikan lifecycle methods seperti componentDidMount, componentDidUpdate, dan componentWillUnmount.",
              type: SectionType.Text,
            },
            // H2 - Component
            {
              content: "Component",
              type: SectionType.H2,
            },
            // P - Penjelasan tentang Component
            {
              content:
                "Komponen adalah elemen dasar dalam React. Setiap aplikasi React terdiri dari komponen-komponen yang dapat dipakai ulang dan dapat berinteraksi satu sama lain. Komponen dapat berupa komponen fungsional atau komponen kelas.",
              type: SectionType.Text,
            },
            // H3 - Custom Component
            {
              content: "Custom Component",
              type: SectionType.H3,
            },
            // P - Penjelasan tentang Custom Component
            {
              content:
                "Custom component adalah komponen yang Anda buat sendiri, yang dapat digunakan kembali di seluruh aplikasi. Komponen ini dapat menerima props dan mengembalikan JSX yang menggambarkan UI.",
              type: SectionType.Text,
            },
            // H3 - Props
            {
              content: "Props",
              type: SectionType.H3,
            },
            // P - Penjelasan tentang Props
            {
              content:
                "Props adalah cara untuk mengirim data dari komponen induk ke komponen anak. Dengan props, Anda dapat membuat komponen yang lebih dinamis dan dapat dikonfigurasi.",
              type: SectionType.Text,
            },
          ],
        },
      },
    },
  });
}

export const GET = async () => {
  const check = await prisma.article.findUnique({
    where: { slug: "html-dasar" },
  });
  const check2 = await prisma.article.findUnique({
    where: { slug: "dasar-react" },
  });

  if (!check) {
    await seed();
  }
  if (!check2) {
    await seed2();
  }

  return NextResponse.json({
    message: "success",
  });
};
