(function() {
    'use strict';

    // Public repo where releases are published
    function getRepoUrl() {
        return 'https://github.com/christianhellsten/WLLBRG';
    }

    // Platform detection
    function detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();

        // Detect OS
        let os = 'linux';
        if (platform.includes('mac') || ua.includes('mac')) {
            os = 'darwin';
        } else if (platform.includes('win') || ua.includes('win')) {
            os = 'windows';
        }

        // Detect architecture
        let arch = 'amd64';
        if (ua.includes('arm64') || ua.includes('aarch64') ||
            (os === 'darwin' && typeof navigator.userAgentData?.getHighEntropyValues === 'function')) {
            // Apple Silicon detection is tricky - default to arm64 for newer Macs
            if (os === 'darwin') {
                // Check for Apple Silicon indicators
                const isAppleSilicon = ua.includes('arm') ||
                    (window.screen.width * window.devicePixelRatio > 2000 &&
                     /mac/i.test(platform));
                if (isAppleSilicon || new Date() > new Date('2021-01-01')) {
                    // Post-2020 Macs are likely Apple Silicon, but we'll provide both options
                    arch = 'arm64';
                }
            } else {
                arch = 'arm64';
            }
        }

        return { os, arch };
    }

    // Get download URL for a specific platform
    function getDownloadUrl(os, arch) {
        const repo = getRepoUrl();
        const ext = os === 'windows' ? 'zip' : 'tar.gz';
        return `${repo}/releases/latest/download/wllbrg_${os}_${arch}.${ext}`;
    }

    // Get display name for platform
    function getPlatformName(os, arch) {
        const names = {
            'darwin_arm64': 'macOS (Apple Silicon)',
            'darwin_amd64': 'macOS (Intel)',
            'linux_amd64': 'Linux (x64)',
            'linux_arm64': 'Linux (ARM64)',
            'windows_amd64': 'Windows (x64)'
        };
        return names[`${os}_${arch}`] || `${os} ${arch}`;
    }

    // Initialize download buttons
    function initDownloads() {
        const detected = detectPlatform();
        const container = document.getElementById('download-buttons');
        if (!container) return;

        const platforms = [
            { os: 'darwin', arch: 'arm64' },
            { os: 'darwin', arch: 'amd64' },
            { os: 'linux', arch: 'amd64' },
            { os: 'linux', arch: 'arm64' },
            { os: 'windows', arch: 'amd64' }
        ];

        // Create buttons
        platforms.forEach(({ os, arch }) => {
            const isDetected = os === detected.os && arch === detected.arch;
            const btn = document.createElement('a');
            btn.href = getDownloadUrl(os, arch);
            btn.className = `download-btn ${os}${isDetected ? ' detected' : ''}`;
            btn.innerHTML = `
                <span class="download-icon">${getOsIcon(os)}</span>
                <span class="download-label">${getPlatformName(os, arch)}</span>
                ${isDetected ? '<span class="download-badge">DETECTED</span>' : ''}
            `;
            container.appendChild(btn);
        });

        // Add "All Releases" link
        const allReleases = document.createElement('a');
        allReleases.href = `${getRepoUrl()}/releases`;
        allReleases.className = 'download-btn all-releases';
        allReleases.innerHTML = `
            <span class="download-icon">[ * ]</span>
            <span class="download-label">All Releases</span>
        `;
        container.appendChild(allReleases);
    }

    function getOsIcon(os) {
        switch (os) {
            case 'darwin': return '[ MAC ]';
            case 'linux': return '[ LNX ]';
            case 'windows': return '[ WIN ]';
            default: return '[ ? ]';
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDownloads);
    } else {
        initDownloads();
    }
})();
