import { Head } from '@inertiajs/react';
import { CreditCard, Users, Smartphone, QrCode } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useBrand } from '@/contexts/BrandContext';
import { useAppearance, THEME_COLORS } from '@/hooks/use-appearance';
import { useFavicon } from '@/hooks/use-favicon';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { getImagePath } from '@/utils/helpers';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    icon?: ReactNode;
    status?: string;
    statusType?: 'success' | 'error';
}
function hexToAdjustedRgba(hex, opacity = 1, adjust = 0) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    const clamp = v => Math.max(-1, Math.min(1, v));
    const getF = (ch) => typeof adjust === 'number' ? clamp(adjust) : clamp(adjust[ch] ?? 0);
    const adj = (c, f) => f < 0 ? Math.floor(c * (1 + f)) : Math.floor(c + (255 - c) * f);
    const rr = adj(r, getF('r'));
    const gg = adj(g, getF('g'));
    const bb = adj(b, getF('b'));
    return opacity === 1
        ? `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`.toUpperCase()
        : `rgba(${rr}, ${gg}, ${bb}, ${opacity})`;
}

export default function AuthLayout({
    children,
    title,
    description,
    icon,
    status,
    statusType = 'success',
}: AuthLayoutProps) {
    useFavicon();
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const { logoLight, logoDark, themeColor, customColor } = useBrand();
    const { appearance } = useAppearance();

    console.log(appearance === 'dark');
    const currentLogo = appearance === 'dark' ? logoLight : logoDark;
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900">
            <Head title={title} />

            {/* Left side - Content  */}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-slate-50 dark:bg-slate-900">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
                        style={{ backgroundColor: `${primaryColor}20` }}
                    ></div>
                    <div
                        className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-15"
                        style={{ backgroundColor: `${primaryColor}30` }}
                    ></div>
                </div>
                {/* Language Switcher - Top Right */}
                <div className="absolute top-4 right-4">
                    <LanguageSwitcher />
                </div>

                <div
                    className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    {/* Mobile branding - only visible on small screens */}
                    <div className="flex flex-col items-center mb-8 lg:hidden">
                        <div
                            className="p-4 rounded-xl shadow-lg inline-flex mb-4"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {currentLogo ? (
                                <img src={getImagePath(currentLogo)} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <CreditCard className="h-8 w-8 text-white" />
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                        <div className="text-center mb-6">
                            {icon && (
                                <div
                                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                    {icon}
                                </div>
                            )}
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
                            {description && (
                                <p className="text-slate-600 dark:text-slate-400">{description}</p>
                            )}
                        </div>

                        {status && (
                            <div className={`mb-6 text-center text-sm font-medium ${statusType === 'success'
                                ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                                : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                                } p-3 rounded-lg border`}>
                                {status}
                            </div>
                        )}

                        {children}
                    </div>


                </div>
            </div>

            {/* Right side - Image */}

            <div
                className="hidden lg:block lg:w-1/2 relative overflow-hidden"
                style={{ backgroundColor: primaryColor }}
            >
               <img src={'screenshots/saas/login_green.jpeg'} alt="Logo" className="h-full object-cover" />
            </div>
            <CookieConsentBanner />
        </div>
    );
}