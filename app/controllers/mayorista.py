#!/usr/bin/env python
# -*- coding: utf-8 -*-

from ferris import Controller, route, scaffold, add_authorizations
from app.models.mayorista import Mayorista
from app.models.medication import Medication
from app.models.pharmacy import Pharmacy
from app.models.denunciation import Denunciation
from app.models.favorite import Favorite
from plugins.custom_auth.models.user import User
from google.appengine.api import urlfetch
import urllib
import ast #Parse String to dictionary

#Used for sort dictionaries
import operator
from collections import OrderedDict

import string

import oauth
from google.appengine.ext import webapp

from plugins.custom_auth.components import custom_auth
from operator import indexOf
from plugins import unidecode #Decode Encode Utf-8 ascii

#Aumentar el tiempo de espera del Request
urlfetch.set_default_fetch_deadline(60)

COUNTRIES_COINS = ['AED','United Arab Emirates Dirham (AED)',
                        'AFN','Afghan Afghani (AFN)',
                        'ALL','Albanian Lek (ALL)',
                        'AMD','Armenian Dram (AMD)',
                        'ANG','Netherlands Antillean Guilder (ANG)',
                        'AOA','Angolan Kwanza (AOA)',
                        'ARS','Argentina Peso (ARS)',
                        'AUD','Australia Dollar (AUD)',
                        'AWG','Aruban Florin (AWG)',
                        'AZN','Azerbaijani Manat (AZN)',
                        'BAM','Bosnia-Herzegovina Convertible Mark (BAM)',
                        'BBD','Barbadian Dollar (BBD)',
                        'BDT','Bangladeshi Taka (BDT)',
                        'BGN','Bulgarian Lev (BGN)',
                        'BHD','Bahraini Dinar (BHD)',
                        'BIF','Burundian Franc (BIF)',
                        'BMD','Bermudan Dollar (BMD)',
                        'BND','Brunei Dollar (BND)',
                        'BOB','Bolivian Boliviano (BOB)',
                        'BRL','Brasil Real (BRL)',
                        'BSD','Bahamian Dollar (BSD)',
                        'BTC','Bitcoin',
                        'BTN','Bhutanese Ngultrum (BTN)',
                        'BWP','Botswanan Pula (BWP)',
                        'BYR','Belarusian Ruble (BYR)',
                        'BZD','Belize Dollar (BZD)',
                        'CAD','Canada Dollar (CA$)',
                        'CDF','Congolese Franc (CDF)',
                        'CHF','Swiss Franc (CHF)',
                        'CLP','Chile Peso (CLP)',
                        'CNH','CNH (CNH)',
                        'CNY','Chinese Yuan (CNY)',
                        'COP','Colombian Peso (COP)',
                        'CRC','Costa Rican Colon (CRC)',
                        'CUP','Cuban Peso (CUP)',
                        'CVE','Cape Verdean Escudo (CVE)',
                        'CZK','Czech Republic Koruna (CZK)',
                        'DEM','Alemania (DEM)',
                        'DJF','Djiboutian Franc (DJF)',
                        'DKK','Danish Krone (DKK)',
                        'DOP','Dominican Peso (DOP)',
                        'DZD','Algerian Dinar (DZD)',
                        'EGP','Egyptian Pound (EGP)',
                        'ERN','Eritrean Nakfa (ERN)',
                        'ETB','Ethiopian Birr (ETB)',
                        'EUR','Euro (EUR)',
                        'FIM','Finnish Markka (FIM)',
                        'FJD','Fijian Dollar (FJD)',
                        'FKP','Falkland Islands Pound (FKP)',
                        'FRF','French Franc (FRF)',
                        'GBP','Reino Unido Libra Esterlina (GBP)',
                        'GEL','Georgian Lari (GEL)',
                        'GHS','Ghanaian Cedi (GHS)',
                        'GIP','Gibraltar Pound (GIP)',
                        'GMD','Gambian Dalasi (GMD)',
                        'GNF','Guinean Franc (GNF)',
                        'GTQ','Guatemalan Quetzal (GTQ)',
                        'GYD','Guyanaese Dollar (GYD)',
                        'HKD','Hong Kong Dollar (HK$)',
                        'HNL','Honduran Lempira (HNL)',
                        'HRK','Croatian Kuna (HRK)',
                        'HTG','Haitian Gourde (HTG)',
                        'HUF','Hungarian Forint (HUF)',
                        'IDR','Indonesian Rupiah (IDR)',
                        'IEP','Irish Pound (IEP)',
                        'ILS','Israeli New Sheqel (ILS)',
                        'INR','Indian Rupee (Rs.)',
                        'IQD','Iraqi Dinar (IQD)',
                        'IRR','Iranian Rial (IRR)',
                        'ISK','Icelandic Krona (ISK)',
                        'ITL','Italian Lira (ITL)',
                        'JMD','Jamaican Dollar (JMD)',
                        'JOD','Jordanian Dinar (JOD)',
                        'JPY','Japanese Yen (JPY)',
                        'KES','Kenyan Shilling (KES)',
                        'KGS','Kyrgystani Som (KGS)',
                        'KHR','Cambodian Riel (KHR)',
                        'KMF','Comorian Franc (KMF)',
                        'KPW','North Korean Won (KPW)',
                        'KRW','South Korean Won (KRW)',
                        'KWD','Kuwaiti Dinar (KWD)',
                        'KYD','Cayman Islands Dollar (KYD)',
                        'KZT','Kazakhstani Tenge (KZT)',
                        'LAK','Laotian Kip (LAK)',
                        'LBP','Lebanese Pound (LBP)',
                        'LKR','Sri Lankan Rupee (LKR)',
                        'LRD','Liberian Dollar (LRD)',
                        'LSL','Lesotho Loti (LSL)',
                        'LTL','Lithuanian Litas (LTL)',
                        'LVL','Latvian Lats (LVL)',
                        'LYD','Libyan Dinar (LYD)',
                        'MAD','Moroccan Dirham (MAD)',
                        'MDL','Moldovan Leu (MDL)',
                        'MGA','Malagasy Ariary (MGA)',
                        'MKD','Macedonian Denar (MKD)',
                        'MMK','Myanmar Kyat (MMK)',
                        'MNT','Mongolian Tugrik (MNT)',
                        'MOP','Macanese Pataca (MOP)',
                        'MRO','Mauritanian Ouguiya (MRO)',
                        'MUR','Mauritian Rupee (MUR)',
                        'MVR','Maldivian Rufiyaa (MVR)',
                        'MWK','Malawian Kwacha (MWK)',
                        'MXN','México Peso (MX$)',
                        'MYR','Malaysian Ringgit (MYR)',
                        'MZN','Mozambican Metical (MZN)',
                        'NAD','Namibian Dollar (NAD)',
                        'NGN','Nigerian Naira (NGN)',
                        'NIO','Nicaraguan Cordoba (NIO)',
                        'NOK','Noruega Corona (NOK)',
                        'NPR','Nepalese Rupee (NPR)',
                        'NZD','New Zealand Dollar (NZ$)',
                        'OMR','Omani Rial (OMR)',
                        'PAB','Panama Balboa (PAB)',
                        'PEN','Perú Nuevo Sol (PEN)',
                        'PGK','Papua New Guinean Kina (PGK)',
                        'PHP','Philippine Peso (Php)',
                        'PKG','PKG (PKG)',
                        'PKR','Pakistani Rupee (PKR)',
                        'PLN','Polish Zloty (PLN)',
                        'PYG','Paraguayan Guarani (PYG)',
                        'QAR','Qatari Rial (QAR)',
                        'RON','Romanian Leu (RON)',
                        'RSD','Serbian Dinar (RSD)',
                        'RUB','Russian Ruble (RUB)',
                        'RWF','Rwandan Franc (RWF)',
                        'SAR','Saudi Riyal (SAR)',
                        'SBD','Solomon Islands Dollar (SBD)',
                        'SCR','Seychellois Rupee (SCR)',
                        'SDG','Sudanese Pound (SDG)',
                        'SEK','Swedish Krona (SEK)',
                        'SGD','Singapore Dollar (SGD)',
                        'SHP','Saint Helena Pound (SHP)',
                        'SLL','Sierra Leonean Leone (SLL)',
                        'SOS','Somali Shilling (SOS)',
                        'SRD','Surinamese Dollar (SRD)',
                        'STD','Sao Tome and Principe Dobra (STD)',
                        'SVC','Salvadoran Colon (SVC)',
                        'SYP','Syrian Pound (SYP)',
                        'SZL','Swazi Lilangeni (SZL)',
                        'THB','Thai Baht (THB)',
                        'TJS','Tajikistani Somoni (TJS)',
                        'TMT','Turkmenistani Manat (TMT)',
                        'TND','Tunisian Dinar (TND)',
                        'TOP','Tongan Paanga (TOP)',
                        'TRY','Turkish Lira (TRY)',
                        'TTD','Trinidad and Tobago Dollar (TTD)',
                        'TWD','New Taiwan Dollar (NT$)',
                        'TZS','Tanzanian Shilling (TZS)',
                        'UAH','Ukrainian Hryvnia (UAH)',
                        'UGX','Ugandan Shilling (UGX)',
                        'USD','EE.UU Dollar ($)',
                        'UYU','Uruguayan Peso (UYU)',
                        'UZS','Uzbekistan Som (UZS)',
                        'VEF','Venezuelan Bolivar (VEF)',
                        'VND','Vietnamese Dong (VND)',
                        'VUV','Vanuatu Vatu (VUV)',
                        'WST','Samoan Tala (WST)',
                        'XAF','CFA Franc BEAC (FCFA)',
                        'XCD','East Caribbean Dollar (EC$)',
                        'XDR','Special Drawing Rights (XDR)',
                        'XOF','CFA Franc BCEAO (CFA)',
                        'XPF','CFP Franc (CFPF)',
                        'YER','Yemeni Rial (YER)',
                        'ZAR','South African Rand (ZAR)',
                        'ZMW','Zambian Kwacha (ZMW)',
                        'ZWL','Zimbabwean Dollar (2009) (ZWL)']


class Mayorista(Controller, webapp.RequestHandler):
    class Meta:
        Model = Mayorista
        components = (custom_auth.CustomAuth, scaffold.Scaffolding)
        Med = Medication
        Pha = Pharmacy
        Den = Denunciation
        Use = User
        Fav = Favorite
     
    @route
    def pruebas(self):
        self.context['medications'] = self.meta.Med.all_medications()
        
    @route
    def index(self):
        'medications'
        
    @route
    def view_medication(self, key):
        item = self.util.decode_key(key).get()   
        
        paises = item.pais
        precios = item.precio_maximo_de_venta_punto_mayorista
        
        dict_paises_precios = {}
        print dict_paises_precios
        #Convertir dos listas en un diccionario pais:precio
        for index, p in enumerate(paises):
            cost = float(string.replace(precios[index], ',', '.')) #Reemplaza comas por puntos, para luego convertir en float
            dict_paises_precios[p] = cost
            print dict_paises_precios
        
        #Ordenar El diccionario por key
        dict_paises_precios = OrderedDict(sorted(dict_paises_precios.items(), key=operator.itemgetter(1)))
        
        #Cambiar floats a String
        list_precios = []
        for c in dict_paises_precios.values():
            list_precios.append(str(c))
            
        #Setear las listas al itme de medicamento
        item.pais = dict_paises_precios.keys()
        item.precio_maximo_de_venta_punto_mayorista = list_precios
       
        
        self.context['medication'] = item
        
        presentations = self.meta.Med.list_medications_all_presentations(item)
        self.context['presentations'] = presentations
        self.context['length_presentations'] = presentations.count()
        
        if self.user():
            self.context['user_lg'] = self.user()
            self.context['user_provider_login'] = self.user().auth_ids[0].split(':')[0]
            self.context['user_id_login'] = self.user().auth_ids[0].split(':')[1]
        else:
            self.context['user_lg'] = None
            self.context['user_provider_login'] = None
            self.context['user_id_login'] = None
        
        
        my_countries_coin = []
        my_countries_code = []

        for p in item.pais:
            p = unidecode.unidecode(p.lower())
            count = 0
            for pc in COUNTRIES_COINS:
                pc = unidecode.unidecode(pc.lower())
                if p in pc:
                    my_countries_code.append(COUNTRIES_COINS[count-1])
                    my_countries_coin.append(unidecode.unidecode(COUNTRIES_COINS[count]))
                count = count + 1
        self.context['countries_coins'] = my_countries_coin
        self.context['countries_codes'] = my_countries_code
        
    @route
    @add_authorizations(custom_auth.require_user)
    def view_favorites(self):
        user_key = self.user().key
        user = self.util.decode_key(user_key).get()
        self.context['user'] = user
        favorites = self.Meta.Fav.find_by_user(user_key)
        list = []
        for elem in favorites:
            list.append(self.util.decode_key(elem.medication).get())
        self.context['favorites'] = list
        self.context['user_lg'] = self.user()
        self.context['user_provider_login'] = self.user().auth_ids[0].split(':')[0]
        self.context['user_id_login'] = self.user().auth_ids[0].split(':')[1]
    
    @route
    def welcome(self):
        if self.user():
            self.context['user_provider_login'] = self.user().auth_ids[0].split(':')[0]
            self.context['user_id_login'] = self.user().auth_ids[0].split(':')[1]
        else:
            self.context['user_provider_login'] = None
            self.context['user_id_login'] = None
    @route
    def register_ok(self):
        'Register Ok'
    
    @route
    def logout(self):
        return 'Logout OK '
    
    @route
    def change_money(self):
        money = self.get_money() 
        sock = urllib.urlopen('https://www.google.com/finance/converter?a=1&from=COP&to=' + money)
        htmlSource = sock.read()
        sock.close()
        
        posIni = htmlSource.find("class=bld")
        posEnd = htmlSource.find("</span>")
        num = htmlSource[posIni+10:posEnd]
        return num
    
    @route
    @add_authorizations(custom_auth.require_user)
    def calification(self, key):
        medication = self.util.decode_key(key).get()
        
        user_calification = int( self.request.get("calification") )
        user_key_str = str(self.user().key.id())
        
        list_user_qualifier = medication.user_qualifier
        dict_user_qualifier = user_key_str + ':' + str(user_calification)
        
        is_calification = False
        
        for elem in  list_user_qualifier:
            if user_key_str in elem:
                is_calification = True
                break
            else:
                is_calification = False
        
        if is_calification == False:
            list_user_qualifier.append(dict_user_qualifier)        
            if medication.calification_value == None or medication.calification_value == '':
                new_calification_value = user_calification
            else:
                new_calification_value = medication.calification_value + user_calification
                
            if medication.calification_amount == None or medication.calification_amount == '':
                new_calification_amount = 1
            else:
                new_calification_amount = medication.calification_amount + 1
            
            medication.user_qualifier = list_user_qualifier
            medication.calification_amount = new_calification_amount
            medication.calification_value = new_calification_value
            medication.put()
        
    @route
    def denunciations(self):
        self.context['medications'] = self.meta.Med.all_medications()
        self.context['pharmacies'] = self.meta.Pha.all_pharmacies()
        self.context['denunciations'] = self.meta.Den.all_denunciations()
        #self.context['users'] = self.meta.Use.all_users()
    
    def get_medication(self):
        if self.request.method == "POST":
            return self.request.get("medication")
    
    def get_money(self):
        if self.request.method == "POST":
            return self.request.get("money")
        
