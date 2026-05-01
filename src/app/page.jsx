"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/admin">admin</Link>
      <Link href="/event">home</Link>

    </>
  );
}
