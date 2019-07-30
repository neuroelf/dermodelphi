#!/usr/bin/env python
# coding: utf-8

# # Converts the source XLSX to JSON file
# 
# Whenever the XLSX source workbook is altered, please
# re-run through this notebook to re-create the corresponding
# JSON file containing the Diagnosis Mapper (base) information.
# 
# To convert this notebook into a plain python script, use
# 
# ```bash
# jupyter nbconvert --to python Diagnosis_mapper_source_to_JSON.ipynb
# ```

# imports, etc.
import html
import pandas as pd

XLSFILE = 'Diagnosis_mapper_source.xlsx'
SHEETNAME = 'TaxonomyBasis'
OUTPUTFILE = 'dm_diagnoses.json'

# define isNaN function, and the ABCNode class
def isNaN(value):
    return value != value

Adict = {}
Bdict = {}
Cdict = {}
class ABCNode:
    def __init__(self, name, level, Aid, Bid, CBid, Cid, syns, mod1, mod2):
        self.name = name.strip()
        self.children = []
        if level == 'A':
            self.id = Aid
            if not Aid in Adict:
                Adict[Aid] = self
        elif level == 'B':
            self.id = Bid
            if not Bid in Bdict:
                Bdict[Bid] = self
            Adict[Aid].children.append(self)
        elif level == 'C':
            self.id = Cid
            self.blockid = CBid
            if isNaN(mod1):
                self.modifiers = []
            elif isNaN(mod2):
                self.modifiers = [mod1.strip().split(';')]
            else:
                self.modifiers = [mod1.strip().split(';'), mod2.strip().split(';')]
            if isNaN(syns):
                self.synonyms = []
            else:
                self.synonyms = syns.strip().split(';')
            Bdict[Bid].children.append(self)
        else:
            self.id = 0
    
    def toJSON(self, clevel=0):
        tstr = ''
        if clevel > 0:
            tstr = "\t" * clevel
        txstr = tstr + "\t"
        openstr = "{\n"
        objstr = txstr + "\"name\": \"" + self.name + "\",\n" + txstr + "\"id\": " + str(self.id) + ",\n"
        numchildren = len(self.children)
        if numchildren > 0:
            objstr += txstr + "\"children\": ["
            for cc in range(numchildren):
                if cc < (numchildren - 1):
                    objstr += self.children[cc].toJSON(clevel + 1) + ",\n" + txstr
                else:
                    objstr += self.children[cc].toJSON(clevel + 1) + "\n"
            objstr += txstr + "]\n"
        else:
            objstr += txstr + "\"blockid\": " + str(self.blockid) + ",\n" + \
                txstr + "\"modifiers\": " + repr(self.modifiers).replace("'", "\"") + ",\n" + \
                txstr + "\"synonyms\": " + repr(self.synonyms).replace("'", "\"") + "\n"
        closestr = tstr + "}"
        return openstr + objstr + closestr

# load the XLSX file into a Pandas DataFrame object
sourcedf = pd.read_excel(XLSFILE, sheet_name=SHEETNAME, header=0)

# collect information about the levels
currentA = None
currentB = None
currentC = None
baseNode = ABCNode('', 0, 0, 0, 0, 0, None, None, None)
for rowindex, row in sourcedf.iterrows():
    syns = row[3]
    mod1 = row[4]
    mod2 = row[5]
    Aid = row[6]
    Bid = row[7]
    CBid = row[9]
    Cid = row[10]
    if not isNaN(row[0]):
        currentA = ABCNode(row[0], 'A', Aid, Bid, CBid, Cid, syns, mod1, mod2)
        baseNode.children.append(currentA)
    if not isNaN(row[1]):
        currentB = ABCNode(row[1], 'B', Aid, Bid, CBid, Cid, syns, mod1, mod2)
    if not isNaN(row[2]):
        currentC = ABCNode(row[2], 'C', Aid, Bid, CBid, Cid, syns, mod1, mod2)

# store converted output to file
with open(OUTPUTFILE, "w", encoding='utf-8') as textfile:
    textfile.write(baseNode.toJSON())

