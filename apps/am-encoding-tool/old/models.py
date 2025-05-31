# filepath: c:\Users\riwan\Documents\Code perso\am-encoding-tool\models.py

from datetime import datetime, time, timezone, timedelta
from decimal import Decimal

class Result:
    def __init__(self, id=None, since=None, participation=None, value=None, wind=None, 
                 seqno=None, metavalue=None, type=None, info=None, 
                 timeperformed=None, official=None):
        self.id = id
        self.since = since
        self.participation = participation
        self.value = value
        self.wind = wind
        self.seqno = seqno
        self.metavalue = metavalue
        self.type = type
        self.info = info
        self.timeperformed = timeperformed
        self.official = official
    
    @classmethod
    def from_db_row(cls, row):
        """Create a Result object from a database row"""
        return cls(
            id=row[0],
            since=row[1],
            participation=row[2],
            value=row[3],
            wind=row[4],
            seqno=row[5],
            metavalue=row[6],
            type=row[7],
            info=row[8],
            timeperformed=row[9],
            official=row[10]
        )
    
    def __str__(self):
        return (f"Result(id={self.id}, since={self.since}, participation={self.participation}, "
                f"value={self.value}, wind={self.wind}, seqno={self.seqno}, "
                f"metavalue={self.metavalue}, type={self.type}, info={self.info}, "
                f"timeperformed={self.timeperformed}, official={self.official})")