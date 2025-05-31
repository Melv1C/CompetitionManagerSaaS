
from datetime import datetime, time, timezone, timedelta
from decimal import Decimal
from models import Result
from db import connect_to_local_db, connect_to_site_db
from getFromSite import get_results
from SiteResult import SiteResult

COMPETITION_ID = 13
EVENT_NAME = '100m - TC M'

if __name__ == '__main__':
    # Connect to the database
    local_db = connect_to_local_db()

    site_db = connect_to_site_db()

    results_site_data = get_results(COMPETITION_ID, EVENT_NAME)

    site_results = [SiteResult.init_from_db(result) for result in results_site_data]

    for site_result in site_results:
        site_result.upsert_to_local_db(local_db)
