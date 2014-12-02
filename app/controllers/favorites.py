from ferris import scaffold, Controller, route
from app.models.favorite import Favorite

class Favorites(Controller):
    class Meta:
        prefixes = ('admin',)
        components = (scaffold.Scaffolding,)
        Fav = Favorite
        
    admin_list = scaffold.list        #lists all 
    admin_view = scaffold.view        #view 
    admin_add = scaffold.add          #add
    admin_edit = scaffold.edit        #edit
    admin_delete = scaffold.delete    #delete
    
    
    @route
    def add_favorite(self):
        user_urlsafe = self.get_user()
        medication_urlsafe = self.get_medication()
        
        theUser = self.util.decode_key(user_urlsafe).get()
        theMedication = self.util.decode_key(medication_urlsafe).get()
        
        theFavorite = self.Meta.Fav.find_by_user_and_medication(theUser.key, theMedication.key)        
        if theFavorite == None:
            Favorite(user=theUser.key, medication=theMedication.key).put()
    
    @route
    def del_favorite(self):
        user_urlsafe = self.get_user()
        medication_urlsafe = self.get_medication()
        
        theUser = self.util.decode_key(user_urlsafe).get()
        theMedication = self.util.decode_key(medication_urlsafe).get()
        
        theFavorite = self.Meta.Fav.find_by_user_and_medication(theUser.key, theMedication.key)
        if theFavorite != None:
            theFavorite.key.delete()
    
    def get_user(self):
        if self.request.method == 'POST':
            return self.request.get('user')
    def get_medication(self):
        if self.request.method == 'POST':
            return self.request.get('medication')