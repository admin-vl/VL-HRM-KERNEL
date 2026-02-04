import { DEVELOPED_BY } from "@/constants/app";

export function AppFooter() {
    return (
        <footer className="border-t bg-white py-4 text-sm text-gray-500">
            <div className="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-6">
                <span>
                    Designed & developed by{' '}
                    <a
                        href={route('home')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-700 hover:underline"
                    >
                        {DEVELOPED_BY}
                    </a>
                </span>

                <span>
                    Powered by{' '}
                    <a
                        href={route('home')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-700 hover:underline"
                    >
                        {DEVELOPED_BY}
                    </a>
                </span>

                {/* <span>
                    Crafted by{' '}
                    <a
                        href="<url>"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-700 hover:underline"
                    >
                        Team
                    </a>
                </span> */}
            </div>
        </footer>
    );
}
