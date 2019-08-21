/**
 * @Time : 2019-08-19 14:02
 * @Author : solacowa@gmail.com
 * @File : service
 * @Software: GoLand
 */

package business

import (
	"context"
	"github.com/go-kit/kit/log"
	"github.com/nsini/cardbill/src/repository"
	"github.com/nsini/cardbill/src/repository/types"
)

type Service interface {
	// 商户列表
	List(ctx context.Context, name string) (res []*types.Business, err error)
}

type service struct {
	logger     log.Logger
	repository repository.Repository
}

func NewService(logger log.Logger, repository repository.Repository) Service {
	return &service{logger: logger, repository: repository}
}

func (c *service) List(ctx context.Context, name string) (res []*types.Business, err error) {
	return c.repository.Business().List()
}