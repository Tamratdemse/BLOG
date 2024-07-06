const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const mongoURI = 'mongodb://localhost:27017/Blog';
mongoose.connect(mongoURI);
const db = mongoose.connection;

db.once('open', function() {
    console.log("Connected to MongoDB successfully!");
});


const contentSchema = new mongoose.Schema({
    article: String,
    content: String
});

const Sport = mongoose.model('Sport', contentSchema);
const NaturalFeature = mongoose.model('NaturalFeature', contentSchema);
const Technology = mongoose.model('Technology', contentSchema);


app.get('/', async function(req, res) {
    try {
        const sportsArticles = await Sport.find();
        const naturalFeaturesArticles = await NaturalFeature.find();
        const technologyArticles = await Technology.find();

        res.render('index', {
            sportsArticles: sportsArticles,
            naturalFeaturesArticles: naturalFeaturesArticles,
            technologyArticles: technologyArticles
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});


app.get('/article/:id', async function(req, res) {
    const articleId = req.params.id;
    try {
        const article = await Sport.findById(articleId) || 
                        await NaturalFeature.findById(articleId) || 
                        await Technology.findById(articleId);
        if (article) {
            res.render('article', { article: article });
        } else {
            res.status(404).send('Article not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching article');
    }
});


app.post('/', function(req, res) {
    var pass = req.body.password;

    if (pass === process.env.pass_D) {
        res.sendFile(__dirname + '/adding_content.html');
    } else {
        res.sendFile(__dirname + '/error.html');
    }
});


app.post('/adding', async function(req, res) {
    const { article, category, content } = req.body;
    try {
        let contentModel;
        switch (category) {
            case 'Sport':
                contentModel = Sport;
                break;
            case 'NaturalFeature':
                contentModel = NaturalFeature;
                break;
            case 'Technology':
                contentModel = Technology;
                break;
            default:
                throw new Error('Invalid category');
        }

        const newContent = new contentModel({ article, content });
        await newContent.save();
        console.log('Successfully added new content');
        res.send('Successfully saved content');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding content');
    }
});

app.post('/remove', async function(req, res) {
    const category = req.body.category;
    const article = req.body.article;

    try {
        let contentModel;
        switch (category) {
            case 'Sport':
                contentModel = Sport;
                break;
            case 'NaturalFeature':
                contentModel = NaturalFeature;
                break;
            case 'Technology':
                contentModel = Technology;
                break;
            default:
                throw new Error('Invalid category');
        }
        const existingArticle = await contentModel.findOne({ article: article });
        if (!existingArticle) {
            return res.status(404).send(`Article "${article}" does not exist in ${category} collection`);
        }
       
        await contentModel.deleteOne({ article: article });
        console.log(`Successfully removed article "${article}" from ${category} collection`);
        res.send(`Successfully removed article "${article}" from ${category} collection`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing article');
    }
});

app.listen(3000, function() {
    console.log('Server running on port 3000');
});
