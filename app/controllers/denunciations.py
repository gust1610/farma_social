from ferris import Controller, scaffold, route
from plugins.custom_auth.models.user import User
from app.models.medication import Medication
from app.models.pharmacy import Pharmacy

class Denunciations(Controller):
    class Meta:
        prefixes = ('admin',)
        components = (scaffold.Scaffolding,)
        Use = User
        Med = Medication
        Pha = Pharmacy
        
    admin_list = scaffold.list        #lists all 
    admin_view = scaffold.view        #view 
    admin_add = scaffold.add          #add
    admin_edit = scaffold.edit        #edit
    admin_delete = scaffold.delete    #delete
    
#     add = scaffold.add
#     edit = scaffold.edit
#     delete = scaffold.delete
    view = scaffold.view
    list = scaffold.list
    
    @route
    def add_denunciation(self):
        the_user = self.meta.Use.find_user(self.get_user())
        med = self.get_medication().split('|')[0]
        pre = self.get_medication().split('|')[1]
        print med
        print pre
        the_medication = self.meta.Med.find_medication(med, pre)
        print the_medication
        the_pharmacy = self.meta.Pha.find_pharmacy(self.get_pharmacy())
        print the_pharmacy
        the_cost = self.get_cost()
        self.meta.Model(user=the_user.key, medication=the_medication.key, pharmacy=the_pharmacy.key, cost=the_cost).put()
        
        
#     GET INFORMATION POST

    def get_user(self):
        if self.request.method == "POST":
            return self.request.get("user")
    def get_medication(self):
        if self.request.method == "POST":
            return self.request.get("medication")
    def get_pharmacy(self):
        if self.request.method == "POST":
            return self.request.get("pharmacy")
    def get_cost(self):
        if self.request.method == "POST":
            return self.request.get("cost")