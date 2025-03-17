import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 md:h-16 items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Tüm hakları saklıdır.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        Built by{" "}
                        <Link
                            href="https://github.com/bilgehangormez"
                            target="_blank"
                            className="font-medium underline underline-offset-4 hover:text-primary"
                        >
                            Bilgehan Gormez
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
