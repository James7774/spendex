const fs = require('fs');
const path = require('path');

const localesDir = './src/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    if (content.landing && content.landing.profile) {
      const p = content.landing.profile;
      
      // Promite keys to root
      if (!content.dangerZone) content.dangerZone = p.dangerZone || "Danger Zone";
      if (!content.clearData) content.clearData = p.clearData || "Clear Data";
      if (!content.logout) content.logout = p.logout || "Log out";
      if (!content.appearance) content.appearance = p.appearance || "Appearance";
      if (!content.account) content.account = p.account || "Account";
      if (!content.confirmLogout) content.confirmLogout = p.confirmLogout || "Are you sure?";
      if (!content.confirmAction) content.confirmAction = p.confirmAction || "Yes";

      // Ensure root profile object exists for personal info
      if (!content.profile) content.profile = {};
      if (!content.profile.personalInfo) content.profile.personalInfo = p.personalInfo;
      if (!content.profile.changePhoto) content.profile.changePhoto = p.changePhoto;
      if (!content.profile.uploadPhoto) content.profile.uploadPhoto = p.uploadPhoto;
      if (!content.profile.removePhoto) content.profile.removePhoto = p.removePhoto;
      if (!content.profile.name) content.profile.name = p.name;
      if (!content.profile.phone) content.profile.phone = p.phone;
      if (!content.profile.editName) content.profile.editName = p.editName;

      // Remove from landing to clean up structure
      delete content.landing.profile; 
      modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`Updated ${file}`);
    } else {
        console.log(`Skipped ${file} (already updated)`);
    }
  } catch (e) {
      console.error(`Error processing ${file}:`, e);
  }
});
