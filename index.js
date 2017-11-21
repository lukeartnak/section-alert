const axios = require('axios');

axios.defaults.headers.common['Access-Token'] = process.env.API_KEY;

async function fetchSections() {
  const crns = ['25664'];
  const res = await axios.get(`http://ws.miamioh.edu/courseSectionV2/201820.json?campusCode=O&crn=${crns.join(',')}`);

  const sections = res.data.courseSections;
  const open_sections = sections
    .filter(section => section.enrollmentCountAvailable > 0)
    .map(section => `${section.courseSubjectCode} ${section.courseNumber} ${section.courseSectionCode}`);

  if (open_sections.length) {
    axios.post('https://api.pushbullet.com/v2/pushes', {
      device_iden: process.env.DEVICE_ID,
      type: 'note',
      title: `${open_sections.length} sections are available!`,
      body: `${open_sections.join(', ')} have available seats!`
    });
  }
}

setInterval(fetchSections, 1000 * 60 * 15);