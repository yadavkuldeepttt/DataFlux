export const logs = [
    {
        id: 'log1',
        objDetails: {
            timestamp: 'Jun 19, 2024 @ 10:00:00.000',
            level: 'info',
            message: '{"level":30,"time:"4pm","request":"completed"}',
            source: 'system',
            metadata: {
                user: 'admin',
                ipAddress: '192.168.1.1',
                location: 'Server Room 1',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'GET',
                    url: '/api/system/start',
                    body: null
                }
            }
        }
    },
    {
        id: 'log2',
        objDetails: {
            timestamp: 'Jun 19, 2024 @ 10:05:00.000',
            level: 'error',
            message: 'Failed to load resource',
            source: 'application',
            metadata: {
                resource: 'api/data',
                user: 'guest',
                errorCode: 404,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                },
                request: {
                    method: 'GET',
                    url: '/api/data/load',
                    body: null
                }
            }
        }
    },
    {
        id: 'log3',
        objDetails: {
            timestamp: 'Jun 19, 2024 @ 10:10:00.000',
            level: 'warning',
            message: 'High memory usage detected',
            source: 'system',
            metadata: {
                memory: '85%',
                threshold: '80%',
                server: 'server1',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/system/memory',
                    body: JSON.stringify({ memory: '85%' })
                }
            }
        }
    },
    {
        id: 'log4',
        objDetails: {
            timestamp: 'Jun 18, 2024 @ 09:00:00.000',
            level: 'info',
            message: 'User login successful',
            source: 'authentication',
            metadata: {
                user: 'john_doe',
                ipAddress: '192.168.1.2',
                location: 'Office',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/user/login',
                    body: JSON.stringify({ username: 'john_doe', password: '******' })
                }
            }
        }
    },
    {
        id: 'log5',
        objDetails: {
            timestamp: 'Jun 17, 2024 @ 08:30:00.000',
            level: 'error',
            message: 'Database connection failed',
            source: 'database',
            metadata: {
                database: 'user_db',
                user: 'system',
                errorCode: 'ECONNREFUSED',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'GET',
                    url: '/api/db/connect',
                    body: null
                }
            }
        }
    },
    {
        id: 'log6',
        objDetails: {
            timestamp: 'Jun 16, 2024 @ 07:20:00.000',
            level: 'debug',
            message: 'Cache refreshed successfully',
            source: 'cache',
            metadata: {
                cache: 'redis',
                duration: '150ms',
                server: 'cache_server',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/cache/refresh',
                    body: JSON.stringify({ cache: 'redis' })
                }
            }
        }
    },
    {
        id: 'log7',
        objDetails: {
            timestamp: 'Jun 15, 2024 @ 06:10:00.000',
            level: 'info',
            message: 'Scheduled maintenance started',
            source: 'system',
            metadata: {
                user: 'maintenance_bot',
                maintenanceWindow: '2 hours',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/maintenance/start',
                    body: JSON.stringify({ window: '2 hours' })
                }
            }
        }
    },
    {
        id: 'log8',
        objDetails: {
            timestamp: 'Jun 14, 2024 @ 05:00:00.000',
            level: 'error',
            message: 'Unauthorized access attempt detected',
            source: 'security',
            metadata: {
                user: 'unknown',
                ipAddress: '192.168.1.100',
                location: 'Unknown',
                actionTaken: 'Blocked',
                headers: {
                    'User-Agent': 'Unknown',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'GET',
                    url: '/api/access/attempt',
                    body: null
                }
            }
        }
    },
    {
        id: 'log9',
        objDetails: {
            timestamp: 'Jun 13, 2024 @ 04:50:00.000',
            level: 'info',
            message: 'Daily backup completed successfully',
            source: 'backup',
            metadata: {
                backupSize: '1.2GB',
                duration: '30 minutes',
                server: 'backup_server',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/backup/complete',
                    body: JSON.stringify({ size: '1.2GB', duration: '30 minutes' })
                }
            }
        }
    },
    {
        id: 'log10',
        objDetails: {
            timestamp: 'Jun 12, 2024 @ 03:40:00.000',
            level: 'warning',
            message: 'Disk space running low',
            source: 'storage',
            metadata: {
                disk: 'sda1',
                availableSpace: '10GB',
                threshold: '15GB',
                server: 'storage_server',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json'
                },
                request: {
                    method: 'POST',
                    url: '/api/disk/space',
                    body: JSON.stringify({ disk: 'sda1', available: '10GB' })
                }
            }
        }
    }
];

