from ferris import Model, ndb
from ferris.core.caching import cache


class Medication(Model):
    #Retorna solo el nombre en los andamios de administracion
    def __unicode__(self):
        info = self.cum + ' ' + self.descripcion_atc
        return info
    
    cum = ndb.StringProperty()    
    atc_invima = ndb.StringProperty()
    descripcion_atc = ndb.StringProperty()
    forma_farmaceutica = ndb.StringProperty()
    producto = ndb.StringProperty()
    cantidad_principio_activo = ndb.StringProperty()
    cantidad_principio_activo_secundario = ndb.StringProperty()
    unidad_base = ndb.StringProperty()
    volumen = ndb.StringProperty()
    unidad_volumen = ndb.StringProperty()
    peso = ndb.StringProperty()
    unidad_peso = ndb.StringProperty()
    concentracion = ndb.StringProperty()
    unidad_concentracion = ndb.StringProperty()
    cantidad_principio_activo_por_presentacion_comercial = ndb.StringProperty()
    titular = ndb.StringProperty()
    estado_cum_marzo_2014 = ndb.StringProperty()
    unidades_por_presentacion_comercial = ndb.StringProperty()
    unidad_de_dispensacion_de_la_presentacion_comercial = ndb.StringProperty()
    presentacion_comercial = ndb.StringProperty()
    id_mercado_relevante = ndb.StringProperty()
    mercado_relevante = ndb.StringProperty()
    circular_cnpmdm = ndb.StringProperty()
    fecha_de_entrada_en_vigencia = ndb.StringProperty()
    margen_de_ips_circular_01_2014 = ndb.StringProperty()
    
    precio_maximo_de_venta_punto_mayorista = ndb.StringProperty(repeated=True, indexed=False)
    pais = ndb.StringProperty(repeated=True, indexed=False)
    conditions = ndb.StringProperty(repeated=True)
    
    calification_value = ndb.IntegerProperty()
    calification_amount = ndb.IntegerProperty()
    calification_average = ndb.ComputedProperty(lambda self: self.calification_value/self.calification_amount if (self.calification_amount!=0 and self.calification_value!=None and self.calification_amount!=None and self.calification_value!='' and self.calification_amount!='') else 0 )
    user_qualifier = ndb.StringProperty(repeated=True)
    
    
    @classmethod
    @cache('all_medications', ttl=3600, backend='datastore')
    def all_medications(cls):
        return cls.query() #.order(cls.name)
    
    @classmethod
    def find_medication(cls, med, pre):
        medications = cls.all_medications()
        for medication in medications:
            if medication.name==med and medication.presentation==pre:
                return medication
    
    @classmethod
    def list_medications_all_presentations(cls, med):
        return cls.all_medications().filter(Medication.descripcion_atc == med.descripcion_atc).order(Medication.cum)
        #return cls.query(Medication.descripcion_atc==med.descripcion_atc).order(Medication.cum)
    
