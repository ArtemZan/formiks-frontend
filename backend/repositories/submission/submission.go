package submission

import (
	"context"
	"sync/atomic"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/doublegrey/formiks/backend/models"
	"github.com/doublegrey/formiks/backend/repositories"
)

func NewSubmissionRepo(Conn *mongo.Database) repositories.SubmissionRepo {
	return &submissionRepo{
		Conn:  Conn,
		Cache: atomic.Value{},
	}
}

type submissionRepo struct {
	Conn  *mongo.Database
	Cache atomic.Value
}

func (r *submissionRepo) FetchVendorTablePresets(ctx context.Context) ([]models.VendorTablePreset, error) {
	presets := make([]models.VendorTablePreset, 0)
	cursor, err := r.Conn.Collection("presets").Find(ctx, bson.M{})
	if err != nil {
		return presets, err
	}
	err = cursor.All(ctx, &presets)
	return presets, err
}

func (r *submissionRepo) UpsertVendorTablePreset(ctx context.Context, data models.VendorTablePreset) error {
	upsert := true
	data.Name = "vendorTable"
	_, err := r.Conn.Collection("presets").ReplaceOne(ctx, bson.M{"name": "vendorTable"}, data, &options.ReplaceOptions{Upsert: &upsert})
	return err
}

func (r *submissionRepo) Fetch(ctx context.Context, filter interface{}) ([]models.Submission, error) {
	submissions := make([]models.Submission, 0)
	cursor, err := r.Conn.Collection("submissions").Find(ctx, filter, options.Find().SetSort(bson.D{{"created", -1}}))
	if err != nil {
		return submissions, err
	}
	err = cursor.All(ctx, &submissions)
	return submissions, err
}

func (r *submissionRepo) FetchByID(ctx context.Context, id primitive.ObjectID) (models.Submission, error) {
	var submission models.Submission
	result := r.Conn.Collection("submissions").FindOne(ctx, bson.M{"_id": id})
	err := result.Decode(&submission)
	return submission, err
}

func (r *submissionRepo) FetchByIDWithChildren(ctx context.Context, id primitive.ObjectID) (models.SubmissionWithChildren, error) {
	var response models.SubmissionWithChildren
	subs := make([]models.Submission, 0)
	cursor, err := r.Conn.Collection("submissions").Find(ctx, bson.M{"$or": []bson.M{{"_id": id}, {"parentId": id.Hex()}}})
	if err != nil {
		return response, err
	}
	err = cursor.All(ctx, &subs)
	if err != nil {
		return response, err
	}

	for _, s := range subs {
		if s.ParentID == nil {
			response.Submission = s
		} else {
			response.Children = append(response.Children, s)
		}
	}

	return response, nil
}

func (r *submissionRepo) Create(ctx context.Context, submission models.Submission) (models.Submission, error) {
	result, err := r.Conn.Collection("submissions").InsertOne(ctx, submission)
	if err == nil {
		submission.ID = result.InsertedID.(primitive.ObjectID)
	}
	return submission, err
}

func (r *submissionRepo) Update(ctx context.Context, submission models.Submission) error {
	_, err := r.Conn.Collection("submissions").ReplaceOne(ctx, bson.M{"_id": submission.ID}, submission)
	return err
}

func (r *submissionRepo) Delete(ctx context.Context, id primitive.ObjectID, children bool) error {
	_, err := r.Conn.Collection("submissions").DeleteOne(ctx, bson.M{"_id": id})
	if children && err == nil {
		_, err = r.Conn.Collection("submissions").DeleteMany(ctx, bson.M{"parentId": id})
	}
	return err
}

func (r *submissionRepo) Exists(ctx context.Context, filter bson.M) bool {
	result, err := r.Conn.Collection("submissions").CountDocuments(ctx, filter, options.Count().SetLimit(1))
	return err == nil && result > 0
}
