from ferris import Controller, scaffold, route

class Pharmacies(Controller):
    class Meta:
        prefixes = ('admin',)
        components = (scaffold.Scaffolding,)
        
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