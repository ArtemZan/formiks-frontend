package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Submission struct {
	ID       primitive.ObjectID     `bson:"_id" json:"id,omitempty"`
	Project  string                 `bson:"project" json:"project"`
	ParentID interface{}            `bson:"parentId" json:"parentId"`
	ViewID   interface{}            `bson:"viewId" json:"viewId"`
	Created  time.Time              `json:"created" bson:"created"`
	Updated  time.Time              `json:"updated" bson:"updated"`
	Title    string                 `json:"title" bson:"title"`
	Status   string                 `json:"status" bson:"status"`
	Author   string                 `json:"author" bson:"author"`
	Group    interface{}            `bson:"group" json:"group"`
	Data     map[string]interface{} `json:"data" bson:"data"`
}

type ProjectNumberChange struct {
	Original  string `json:"original"`
	Generated string `json:"generated"`
	Child     bool   `json:"child"`
}

type SubmissionWithChildren struct {
	Submission Submission   `json:"submission"`
	Children   []Submission `json:"children"`
	Local      *string      `json:"local,omitempty"`
}

type SubmissionWithChildrenResponse struct {
	Submission Submission   `json:"submission"`
	Children   []Submission `json:"children"`
	HasChanged bool         `json:"hasChanged"`
}

type PartialUpdateRequest struct {
	Submission primitive.ObjectID `bson:"submission" json:"submission"`
	Path       string             `bson:"path" json:"path"`
	Value      interface{}        `bson:"value" json:"value"`
}

type VendorTablePreset struct {
	ID               primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name             string             `bson:"name" json:"name"`
	DisplayedColumns []string           `bson:"displayedColumns" json:"displayedColumns"`
	ColumnsWidth     map[string]int     `bson:"columnsWidth" json:"columnsWidth"`
}
