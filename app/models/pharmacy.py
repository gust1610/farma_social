from ferris import Model, ndb

class Pharmacy(Model):
    #Retorna solo el nombre en los andamios de administracion
    def __unicode__(self):
        return self.name
    
    name = ndb.StringProperty()
    address = ndb.StringProperty()
    
    @classmethod
    def all_pharmacies(cls):
        return cls.query().order(cls.name)
    @classmethod
    def find_pharmacy(cls, addr):
        pharmacies = cls.all_pharmacies()
        for pharmacy in pharmacies:
            if pharmacy.address == addr:
                return pharmacy