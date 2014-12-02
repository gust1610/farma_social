from ferris import Model, ndb
from plugins.custom_auth.models.user import User
from app.models.medication import Medication
from app.models.pharmacy import Pharmacy

class Denunciation(Model):
    user = ndb.KeyProperty(kind = User)
    medication = ndb.KeyProperty(kind = Medication) #Arreglarrrrrrr
    pharmacy = ndb.KeyProperty(kind = Pharmacy)
    cost = ndb.StringProperty()
    
    @classmethod
    def all_denunciations(cls):
        return cls.query().order(cls.cost)