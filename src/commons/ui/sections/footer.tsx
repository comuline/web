import Link from "next/link";

const Footer = () => (
  <div className="flex w-full flex-col gap-[20px] py-10 text-center text-sm">
    <p className="mx-auto w-2/3 opacity-50">
      Made as an act of belief that public transportation data should be
      publicly accessible
    </p>

    <div className="mx-auto flex  items-center gap-[10px]">
      <Link
        target="_blank"
        href="https://status.jadwal-krl.com/"
        className="underline opacity-50 transition hover:opacity-100"
      >
        Status
      </Link>
      <p className="opacity-30">⋅</p>
      <Link
        target="_blank"
        href="https://www.api.jadwal-krl.com/docs"
        className="underline opacity-50 transition hover:opacity-100"
      >
        API
      </Link>
      <p className="opacity-30">⋅</p>
      <Link
        target="_blank"
        href="https://github.com/abielzulio/jadwal-krl"
        className="underline opacity-50 transition hover:opacity-100"
      >
        GitHub
      </Link>
      <p className="opacity-30">⋅</p>
      <Link
        target="_blank"
        href="https://analytics.zulio.me/share/t1FN42zTmHDAdUiP/www.jadwal-krl.com"
        className="underline opacity-50 transition hover:opacity-100"
      >
        Analytics
      </Link>
      <p className="opacity-30">⋅</p>
      <Link
        target="_blank"
        href="https://www.nihbuatjajan.com/lio"
        className="underline opacity-50 transition hover:opacity-100"
      >
        Donate
      </Link>
    </div>
  </div>
);

export default Footer;
