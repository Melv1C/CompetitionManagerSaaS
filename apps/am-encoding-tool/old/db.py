from dotenv import load_dotenv
import os
import psycopg2


load_dotenv()

def connect_to_local_db():
    """Connect to the PostgreSQL database server"""
    conn = None
    try:
        # Connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(
            host=os.getenv('DB_LOCAL_HOST'),
            port=os.getenv('DB_LOCAL_PORT'),
            database=os.getenv('DB_LOCAL_NAME'),
            user=os.getenv('DB_LOCAL_USER'),
            password=os.getenv('DB_LOCAL_PASSWORD')
        )
        # Create a cursor
        print('Connection successful. (local)')
        return conn.cursor()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")

def connect_to_site_db():
    """Connect to the PostgreSQL database server"""
    conn = None
    try:
        # Connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(
            host=os.getenv('DB_SITE_HOST'),
            port=os.getenv('DB_SITE_PORT'),
            database=os.getenv('DB_SITE_NAME'),
            user=os.getenv('DB_SITE_USER'),
            password=os.getenv('DB_SITE_PASSWORD')
        )
        print('Connection successful. (site)')
        # Create a cursor
        return conn.cursor()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")