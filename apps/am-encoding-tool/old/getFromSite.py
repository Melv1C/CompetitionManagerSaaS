from db import connect_to_site_db



site_db = connect_to_site_db()

def get_results(competition_id, event_name):
    """Fetch results for a specific competition and event from the site database."""
    query = """
    SELECT ce."name", a.license, r.value, r.wind, e."type"
    FROM results r
    left join competition_events ce
    on r.competition_event_id = ce.id
    left join athletes a 
    on r.athlete_id = a.id
    left join events e
    on ce.event_id = e.id
    WHERE r.competition_id = %s AND ce."name" = %s
    """
    site_db.execute(query, (competition_id, event_name))
    results = site_db.fetchall()

    for result in results:
        print(result)
    
    return results

