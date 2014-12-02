from ferris import Model, ndb
from app.models.medication import Medication
from plugins.custom_auth.models.user import User

class Favorite(Model):
    user = ndb.KeyProperty(kind=User)
    medication = ndb.KeyProperty(kind=Medication)
    
    @classmethod
    def find_by_user_and_medication(self, theUser, theMedication):
        return self.query(self.user == theUser, self.medication == theMedication).get()
    
    @classmethod
    def find_by_user(cls, theUser):
        return cls.query(cls.user==theUser)