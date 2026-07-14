
class AboutController {
   index(req, res) {
    res.render('about');
  }

show(req, res) {
  res.send('about page with slug: ');
}

}

module.exports = new AboutController();