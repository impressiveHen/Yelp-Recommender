from flask import Flask, request, jsonify, make_response, abort
from flask_restplus import Api, Resource, fields
import numpy as np
import pickle
import sys
from createContentModel import ContentModel

app = Flask(__name__)
api = Api(app=app,
          version="1.0",
          title="Yelp Recommender",
          description="Make recommendations with a Yelp id, return list of recommendations in Yelp ids")

# http://127.0.0.1:5000/Yelp
name_space = api.namespace('Yelp', description='Recommend Restaurants')

# To receive or send information in a particular format (JSON) we accomplish this
# with the help of model
# The API which will use this model will expect a JSON with a key as 'resId' and a key as 'number .
model = api.model('Recommend params',
                  {'resId': fields.String(required=True,
                                          description="Restaurant id",
                                          help="Restaurant id must not be blank"),
                   'number': fields.Integer(required=True,
                                            description="Number of recommendations to make",
                                            help="Number of recommendations must not be blank")})

with open('./contentModel.pkl', 'rb') as f:
    contentRecommender = pickle.load(f)

@name_space.route("/")
class MainClass(Resource):
    # CORS
    def options(self):
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    # Using doc we can define the documentation for the API in Swagger
    @api.doc(responses={200: 'OK', 400: 'Bad Request'})
    # API expects defined model
    @api.expect(model)
    def post(self):
        try:
            formData = request.json
            prediction = contentRecommender.makeRecomm(
                formData['resId'], formData['number'])
            response = jsonify({
                "statusCode": 200,
                "status": "Recommendation made",
                "result": prediction
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        except Exception as error:
            return jsonify({
                "statusCode": 500,
                "status": "Could not make recommendation",
                "error": str(error)
            })

if __name__ == '__main__':
    app.run(debug=True)