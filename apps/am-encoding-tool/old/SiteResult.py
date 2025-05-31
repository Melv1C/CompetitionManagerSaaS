import psycopg2
from enum import Enum

class EventType(Enum):
    TIME = 'time'
    DISTANCE = 'distance'
    POINTS = 'points'
    HEIGHT = 'height'


def EventType_to_localType(event_type):
    """Convert EventType to local database type.
    
    Args:
        event_type: Can be either an EventType enum value or a string.
    """
    # If event_type is a string, try to convert it to EventType enum
    if isinstance(event_type, str):
        event_type = EventType(event_type)
        
    # Now handle the EventType enum
    if event_type == EventType.TIME:
        return 'PHF' 
    elif event_type == EventType.DISTANCE:
        return 'USR'
    elif event_type == EventType.POINTS:
        return 'points'
    elif event_type == EventType.HEIGHT:
        return 'USR'
    else:
        raise ValueError(f"Unknown event type: {event_type}")
    
class SiteDetails:
    def __init__(self, value, wind=None, try_number=1):
        self.value = value
        self.wind = wind
        self.try_number = try_number
    
    @classmethod
    def init_from_socketio(cls, data):
        """Initialize the SiteDetails object from socket.io data."""
        instance = cls(
            value=data['value'],
            wind=data['wind'],
            try_number=data['tryNumber']
        )
        return instance

class SiteResult:
    def __init__(self, event_name, license, value, wind=0, type: EventType = EventType.TIME, metavalue=None, details: list[SiteDetails] = []):
        self.event_name = event_name
        self.license = license
        self.value = value
        self.wind = wind
        self.metavalue = metavalue
        self.type = type
        self.details = details

    # @classmethod
    # def init_from_db(cls, data):
    #     """Initialize the SiteResult object from a database row."""
    #     instance = cls(
    #         event_name=data[0],
    #         license=data[1],
    #         value=data[2],
    #         wind=data[3],
    #         type=EventType[data[4]] if data[4] is not None else EventType.TIME
    #     )
    #     return instance
    
    @classmethod
    def init_from_socketio(cls, data):
        """Initialize the SiteResult object from socket.io data."""
        instance = cls(
            event_name=data['competitionEvent']['name'],
            license=data['athlete']['license'],
            value=data['value'],
            wind=data['wind'],
            type=data['competitionEvent']['event']['type'],
            details=[
                SiteDetails.init_from_socketio(d) for d in data['details']
            ]
        )
        return instance

    def upsert_to_local_db(self, local_db: psycopg2.extensions.cursor):
        # get existing result for this license and event
        result_query = """
        select r.id, e."name", l.licensenumber, r.value, r.wind, r.seqno
        from results r
        left join participations p 
        on r.participation = p.id
        left join rounds r2 
        on p.round = r2.id
        left join events e
        on r2.event = e.id
        left join participants p2 
        on p2.participation = p.id
        left join competitors c 
        on p2.competitor = c.id
        left join athletes a 
        on c.athlete = a.id
        left join licenses l 
        on l.athlete = a.id
        where l.licensenumber = %s and e."name" = %s
        """
        local_db.execute(result_query, (self.license, self.event_name))
        existing_results = local_db.fetchall()

        participation_query = """
        SELECT 
        p.id
        FROM participations p
        LEFT JOIN participants p2 ON p2.participation = p.id
        LEFT JOIN competitors c ON p2.competitor = c.id
        LEFT JOIN athletes a ON c.athlete = a.id
        LEFT JOIN rounds r ON p.round = r.id
        LEFT JOIN events e ON r.event = e.id
        LEFT JOIN licenses l ON l.athlete = a.id
        WHERE l.licensenumber = %s
        AND (
        (r.name = '*' AND e.name = %s) 
        OR (r.name = %s)
        );
        """
        local_db.execute(participation_query, (self.license, self.event_name, self.event_name))
        participations = local_db.fetchone()


        for detail in self.details:
            value_to_insert = detail.value / 1000 if self.type == EventType.TIME else detail.value
            found = False
            for result in existing_results:
                if result[5] == detail.try_number:
                    found = True
                    # Update existing result with try number
                    update_query = """
                    UPDATE results
                    SET value = %s, wind = %s
                    WHERE id = %s
                    """
                    local_db.execute(update_query, (value_to_insert, detail.wind, result[0]))
                    break
            if not found:
                if participations:
                    participation_id = participations[0]
                    # Insert new result
                    create_query = """
                    INSERT INTO results (since, participation, value, wind, seqno, metavalue, type, info, timeperformed, official)
                    VALUES (NOW(), %s, %s, %s, %s, 0, %s, NULL, NOW(), 0)
                    """
                    local_db.execute(create_query, (participation_id, value_to_insert, detail.wind, detail.try_number, EventType_to_localType(self.type)))
                else:
                    pass
        #Remove result that are not in the details
        if len(self.details) < len(existing_results):
            ids_to_remove = [result[0] for result in existing_results if result[5] not in [d.try_number for d in self.details]]
            if ids_to_remove:
                delete_query = """
                DELETE FROM results
                WHERE id IN %s
                """
                local_db.execute(delete_query, (tuple(ids_to_remove),))
        local_db.connection.commit()