#!/usr/bin/env python3
"""
Verification script to ensure demo environment is properly configured.
Run this after completing setup steps to verify all dependencies.
"""

import sys
from pathlib import Path

def check_redis():
    """Verify Redis Stack connection and vector search capabilities."""
    try:
        import redis
        from redis.commands.search.field import VectorField

        # Connect to Redis
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)

        # Test connection
        r.ping()
        print("✓ Redis connection successful")

        # Check for RediSearch module
        modules = r.module_list()
        module_names = [m['name'].decode() if isinstance(m['name'], bytes) else m['name'] for m in modules]

        if 'search' in module_names:
            print("✓ Redis Stack modules loaded (search, vector)")
        else:
            print("✗ RediSearch module not loaded - ensure you're using Redis Stack")
            return False

        return True

    except ImportError:
        print("✗ Redis Python package not installed")
        print("  Run: pip install redis")
        return False
    except redis.ConnectionError:
        print("✗ Cannot connect to Redis")
        print("  Ensure Redis Stack is running on localhost:6379")
        print("  Try: docker run -d -p 6379:6379 redis/redis-stack:latest")
        return False
    except Exception as e:
        print(f"✗ Redis check failed: {e}")
        return False

def check_sqlite():
    """Verify SQLite is available."""
    try:
        import sqlite3

        # Create in-memory database to test
        conn = sqlite3.connect(':memory:')
        conn.execute('CREATE TABLE test (id INTEGER)')
        conn.close()

        print("✓ SQLite working")
        return True

    except Exception as e:
        print(f"✗ SQLite check failed: {e}")
        return False

def check_openai():
    """Verify OpenAI API key is configured."""
    try:
        import os
        from dotenv import load_dotenv

        # Load .env from demos directory
        env_path = Path(__file__).parent.parent / '.env'
        load_dotenv(env_path)

        api_key = os.getenv('OPENAI_API_KEY')

        if api_key and api_key.startswith('sk-'):
            print("✓ OpenAI API key configured")
            return True
        else:
            print("✗ OpenAI API key not found or invalid")
            print(f"  Create .env file at: {env_path}")
            print("  Add: OPENAI_API_KEY=your_key_here")
            return False

    except ImportError:
        print("✗ python-dotenv not installed")
        print("  Run: pip install python-dotenv")
        return False

def check_dependencies():
    """Check all required Python packages are installed."""
    required_packages = [
        'redis',
        'openai',
        'numpy',
        'pandas',
        'dotenv',
    ]

    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)

    if missing:
        print(f"✗ Missing packages: {', '.join(missing)}")
        print("  Run: pip install -r requirements.txt")
        return False
    else:
        print("✓ All dependencies installed")
        return True

def main():
    """Run all verification checks."""
    print("Verifying demo environment setup...\n")

    checks = [
        check_redis(),
        check_sqlite(),
        check_openai(),
        check_dependencies(),
    ]

    print()

    if all(checks):
        print("=" * 50)
        print("Environment ready for demos!")
        print("=" * 50)
        print("\nNext steps:")
        print("1. cd demos/01_sql_search")
        print("2. python demo.py")
        return 0
    else:
        print("=" * 50)
        print("Setup incomplete - please fix issues above")
        print("=" * 50)
        return 1

if __name__ == '__main__':
    sys.exit(main())
