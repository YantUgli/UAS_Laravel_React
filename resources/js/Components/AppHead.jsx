import { Head } from '@inertiajs/react';
import AppConfig from '@/config/app';

export default function AppHead({ title = '' }) {
    // const fullTitle = title
    //     ? `${title} | ${AppConfig.name}`
    //     : AppConfig.name;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content='Uas project' />

            {/* Favicon dari config */}
            <link rel="icon" href={AppConfig.logoUrl} type="image/png" />
            <link rel="shortcut icon" href={AppConfig.logoUrl} type="image/png" />

            {/* Optional: Apple touch icon untuk mobile */}
            <link rel="apple-touch-icon" href={AppConfig.logoUrl} />
        </Head>
    );
}