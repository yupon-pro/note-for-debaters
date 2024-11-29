package infrastructure

import "gorm.io/gorm"


type Transaction interface {
	Begin() error
	Commit() error
	Rollback() error
}

type GormTransaction struct {
	tx *gorm.DB
}

func NewTransactionManager(tx *gorm.DB) Transaction {
	return &GormTransaction{tx:tx}
}

func (g *GormTransaction) Begin() error {
	tx := g.tx.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	g.tx = tx
	return nil
}

func (g *GormTransaction) Commit() error {
	return g.tx.Commit().Error
}

func (g *GormTransaction) Rollback() error {
	return g.tx.Rollback().Error
}
