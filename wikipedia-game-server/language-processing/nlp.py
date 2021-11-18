# pip install -U spacy
# python -m spacy download en_core_web_sm
import spacy
import json
import sys 
import base64

# Load English tokenizer, tagger, parser and NER
nlp = spacy.load("en_core_web_sm")

# Process whole documents
#text = ("The Cantor set is a subset of real numbers with certain properties that are interesting to mathematicians. These properties relate to topology, measurement, geometry, as well as set theory. Some of them are: When represented geometrically, the set is a fractal, it has a Hausdorff dimension which is not an integer It has the same cardinality as the set of real numbers It is self-similarThe set is named after Georg Cantor. Henry John Stephen Smith discovered it in 1875, and Cantor first described it in 1883. The set is made by starting with a line segment and repeatedly removing the middle third.  The Cantor set is the (infinite) set of points left over.  The Cantor set is \"more infinite\" than the set of natural numbers (1, 2, 3, 4, etc.).  This property is called uncountability.  It is related to the Smith–Volterra–Cantor set and the Menger Sponge. The Cantor set is self-similar. Fractal Set theory Smith–Volterra–Cantor set Cantor dust Menger Sponge Barile, Margherita and Weisstein, Eric W. \"Cantor Set\". Wolfram MathWorld. Retrieved 23 January 2012.CS1 maint: multiple names: authors list (link) Su, Francis E.,;  et al. \"Cantor Set\". Math Fun Facts. Archived from the original on 14 January 2012. Retrieved 23 January 2012.CS1 maint: extra punctuation (link) CS1 maint: multiple names: authors list (link) Neal Carothers. \"The Cantor Set\". Archived from the original on 2012-02-04. Retrieved 2012-01-23. Cantor set at PRIME  Media related to Cantor sets at Wikimedia Commons ")
text = str(sys.argv[1])
text = base64.b64decode(text).decode('utf-8')
doc = nlp(text)

# Loading generator as a list instead,
# because this all needs to exist in memory to be serialized as json anyway
sentences = []
for sent in doc.sents:
        sentences.append(sent.text)
output = json.dumps({'sentences': sentences})
output_bytes = output.encode('utf-8')
base64_bytes = base64.b64encode(output_bytes)
base64_output = base64_bytes.decode('utf-8')
print(base64_output)

