# dermodelphi (Diagnosis Mapper backend and website)
This is the repository for the Diagnosis Mapper developed at
[Memorial Sloan Kettering Cancer Center](https://www.mskcc.org/), MSKCC.
It includes:
- the original data source (basis) of the taxonomy presented (in the ```/basis``` folder)
- the code for the website, using [React](https://reactjs.org/) (in the ```/mern-app``` folder)
- and the code for the backend, using [mongodb](https://www.mongodb.com/) and [Express](https://expressjs.com/) (in the ```/mern-backend``` folder)

All code was developed using [Visual Studio Code](https://code.visualstudio.com/),
and runs on [Node.js](https://nodejs.org/) v.10.16.0.

## Authors / Collaborators
- Jochen Weber (MSKCC), coding
- Veronica Rotemberg (MSKCC), project supervision
- Konstantinos Liopyris (MSKCC), project co-coordinator
- Alon Scope (MSKCC), project co-coordinator

## Installation steps
Below is a list of installation steps that were performed to install
the Diagnosis Mapper on a fresh Azure VM instance, using CentOs 7.5

~~~~
# you can skip this if your instance has >= 4GB or some swap already!
sudo fallocate -l 2G /swapfile
sudo dd if=/dev/zero of=/swapfile bs=2048 count=1048576
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo echo "/swapfile swap swap defaults 0 0" >> /etc/fstab

# update OS
sudo yum install -y epel-release
sudo yum update

# prepare for and add Node.js repo, then install Node.js
sudo yum install -y gcc-c++ make
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
sudo yum install -y nodejs
sudo npm install -g nodemon

# install Apache/httpd, git
sudo yum install -y httpd
sudo yum install -y git

# install mongodb (requires step from:
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/ (1))
sudo yum install -y mongodb-og

# create repository folder, and clone git repo
mkdir ~/dermodelphi
cd ~/dermodelphi
git clone https://github.com/neuroelf/dermodelphi ./

# install required packages and build React production files
cd ~/dermodelphi/mern-app
npm install
npm run build
cd ~/dermodelphi/mern-backend
npm install

# create the necessary md5salt.js file, please use your own SECRET!
echo "module.exports.md5salt = '<YOUR_SECRET_HERE>';" >> md5salt.js

# allow/activate localhost proxy (see
# https://serverfault.com/questions/382076/apache-proxy-not-working-for-a-localhost-port)
sudo setsebool -P httpd_can_network_connect on

# start mongodb and backend (Express in Node.js) servers
cd ~/dermodelphi/mern-backend
mkdir mongodb
./dm_mongo.sh
./dm_server.sh

# copy data
sudo cp -r ~/dermodelphi/mern-app/build/* /var/www/html/

# start Apache (please install httpd.conf and certificates, see below!)
sudo systemctl enable httpd
sudo apachectl start
~~~~

To configure the website with an SSL certificate, the following steps were performed:

~~~~
# install certbot
sudo yum install certbot python2-certbot-apache
sudo certbot --apache

# make sure to check the /etc/httpd/conf/httpd.conf file to ensure SSL rewrite rules are OK!
~~~~

If you wish to develop
- download mongodb for your machine, and start it with your preferred settings
- clone the repository into a folder
- if you haven't (globally) installed nodemon, use ```npm install -g nodemon``` (make sure that python version 2 is first on the path!)
- run ```npm install``` in both the mern-app and mern-backend folders
- run ```nodemon server.js``` in the mern-backend folder
- run ```npm start``` (or ```npm run build```) in the mern-app folder

### Building with parcel (without minification)
In preparation for a separate project, I also wanted to support building the
web application using [Parcel.js](https://parceljs.org/). The following steps
can be performed in addition to the regular build with node/npm:

- install Parcel.js with ```npm install -g parcel-bundler```
- optionally install [serve](https://www.npmjs.com/package/serve) with ```npm install -g serve```
- create the folders ```/build/parcel``` and ```/build/parcel/dist```
- copy the file ```/parcel.env``` to ```/build/parcel/.env```
- copy the contents of the ```/public``` and ```/src``` folders to the ```/build/parcel``` folder
- in the ```/build/parcel``` folder, execute ```parcel build parcel.html --no-minify -o index.html```
- to serve the content, change into folder ```/build/parcel/dist``` and execute ```serve .```

## History
### Summary from initial discussion with collaborators on 7/10/2019
Data capture for the Delphi project:

The taxonomy has four (4) preliminary levels (prior to stage 1 of the Delphi process):

- A: so far only benign (color coded either green or blue, give people a preference), and malignant (color coded red)
- B: super-category of diagnoses (e.g. Cysts)
- C: diagnostic label that clinical assessors need to provide for diagnosis and image upload (e.g. Milium)
- D: optional sub-category/modifiers (which will not be fully captured by the first round of Delphi!)

For the diagnosis labels (level C), people might have a different preference
for the order of "Term (explanation)" vs. "Explanation (Term)", and should be
able to make a global selection to see the labels in their preference of order.

People START with level C (generally alphabetically, by B, with exceptions;
and beginning with benign, then malignant categories).

The overall visualization should allow people to see (readily):

- the overall structure
- which parts of C (boxes) they have already answered (e.g. by displaying those labels with the text faded + lock icon)
- each label (B and C) is a link to the corresponding page

For EACH level:

- top control: checkbox "everything clear", which checks all "correct" boxes, locks the pane, and people click next
- bottom controls:
  - next button (will be "resume" if jumped there from search), if page incomplete, mark missing information and don't allow continue; once next is pressed successfully "lock" page
  - lock/unlock icon with button "click to edit" (only clickable if controls are currently locked)

For A:

- multiple-entry: add entry to hierarchy level, add FREETEXT "new_label"
- correct (TRUE or FALSE)
- if NOT correct (correct == FALSE), also capture
  - label incorrect (more severe than type), add FREETEXT "corrected_label"

For both B/C:

- multiple-entry: add entry to hierarchy level, add FREETEXT "new_label"
- correct (TRUE or FALSE), if checked, disable dropdown
- if NOT correct (correct == FALSE), also capture
  - misspelled/typo, add FREETEXT "corrected_label"
  - label incorrect/change term (more severe than typo), add FREETEXT "changed_label"
  - additional synonyms, add FREETEXT, "synonyms_label"
  - (for C only) combine entry with another entry (B+B, C+C), dropdown with all of same B + add "other" + FREETEXT "combine_other_label"
  - add sub-category, modifiers (i.e. add "D"), + FREETEXT "modifiers_for_label"
  - change hierarchy: assign level of C to different level of A/B (two dropdowns, add "other", which alters hierarchy A or B; if entry for A is added, add union of all Bs to that A)
  - (for C only, if modifier exists) "modifier needs work", + FREETEXT "change_modifier"
  - (for C only) delete label
  - comments: add FREETEXT "comments"

Views:

- top view is a (partial) tree with the current *BOX* of level C
- controls
  - top row
    - "see full list" (button/link)
    - #/N counter for boxes
    - search box for elements (with "Go!" link activated when a term is selected)
  - bottom "row"
    - partial tree view

- bottom view is the "agreement configuration" view
- controls:
  - full agreement (checkbox, will check all agrees, lock all other controls; if other controls touched, disable this)
  - rows with
    - label (with optional D/modifiers in smaller font below)
    - agree checkbox (if clicked, disable other row controls, once changes are made in other controls, agree becomes disable)
    - disagree *dropdown* (with initial selection being "select...")
    - plus additional control (free text or dropdown)
  - add entry, if clicked, add row with text field and pre-checked "agree" as well as "delete" button, add entry button then moved one row below
  - bottom row:
    - next/resume (resume if jumped there)
    - lock/unlock icon with "click to edit" link that is disabled if controls are unlocked, once next is clicked, perform plausibility checks, if unsuccessful, highlight rows with problems, or if successful, lock this "page" (box) and either move on or return to previous location
