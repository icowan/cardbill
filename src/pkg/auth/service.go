/**
 * @Time: 2019-08-18 16:56
 * @Author: solacowa@gmail.com
 * @File: service
 * @Software: GoLand
 */

package auth

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
	"github.com/google/go-github/v26/github"
	"github.com/icowan/config"
	cbjwt "github.com/nsini/cardbill/src/jwt"
	"github.com/nsini/cardbill/src/repository"
	"github.com/nsini/cardbill/src/repository/types"
	"golang.org/x/oauth2"
	oauthgithub "golang.org/x/oauth2/github"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

var (
	ErrInvalidArgument        = errors.New("invalid argument")
	ErrAuthLoginGitHubGetUser = errors.New("获取Github用户邮箱及名称失败.")
)

type Service interface {
	// github 授权登陆跳转
	AuthLoginGithub(w http.ResponseWriter, r *http.Request)

	// github 授权登陆回调
	AuthLoginGithubCallback(w http.ResponseWriter, r *http.Request)

	// weibo 授权登录跳转
	AuthLoginWeibo(w http.ResponseWriter, r *http.Request)

	// weibo 授权登陆回调
	AuthLoginWeiboCallback(w http.ResponseWriter, r *http.Request)

	// 微信授权登录
	AuthLoginWechat(w http.ResponseWriter, r *http.Request)

	// 微信授权登录回调
	AuthLoginWechatCallback(w http.ResponseWriter, r *http.Request)

	// 微信小程序授权登录
	AuthLoginMP(ctx context.Context, code, iv, rawData, signature, encryptedData, inviteCode string) (res loginResponse, err error)
}

type service struct {
	logger     log.Logger
	config     *config.Config
	repository repository.Repository
}

func (c *service) AuthLoginMP(ctx context.Context, code, iv, rawData, signature, encryptedData, inviteCode string) (res loginResponse, err error) {
	panic("implement me")
}

func (c *service) AuthLoginWechat(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (c *service) AuthLoginWechatCallback(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (c *service) AuthLoginWeibo(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (c *service) AuthLoginWeiboCallback(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (c *service) AuthLoginGithub(w http.ResponseWriter, r *http.Request) {
	githubOauthConfig := c.auth2Config()

	// Create oauthState cookie
	oauthState := generateStateOauthCookie(w)
	u := githubOauthConfig.AuthCodeURL(oauthState)
	http.Redirect(w, r, u, http.StatusTemporaryRedirect)
}

func (c *service) auth2Config() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     c.config.GetString("github", "client_id"),
		ClientSecret: c.config.GetString("github", "client_secret"),
		Scopes:       []string{"SCOPE1", "SCOPE2", "user:email"},
		Endpoint:     oauthgithub.Endpoint,
	}
}

func generateStateOauthCookie(w http.ResponseWriter) string {
	var expiration = time.Now().Add(365 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)
	// todo 用jwt生成 然后 jwt 解析出来
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration}
	http.SetCookie(w, &cookie)

	return state
}

func (c *service) AuthLoginGithubCallback(w http.ResponseWriter, r *http.Request) {
	var resp authResponse

	ctx := context.Background()
	// state := r.URL.Query().Get("state") // todo 它需要验证一下可以考虑使用jwt生成  先用cookie 简单处理一下吧...

	if httpProxy := c.config.GetString("server", "http_proxy"); httpProxy != "" {
		_ = level.Debug(c.logger).Log("use-proxy", httpProxy)
		dialer := &net.Dialer{
			Timeout:   time.Duration(5 * int64(time.Second)),
			KeepAlive: time.Duration(5 * int64(time.Second)),
		}
		ctx = context.WithValue(ctx, oauth2.HTTPClient, &http.Client{
			Transport: &http.Transport{
				Proxy: func(_ *http.Request) (*url.URL, error) {
					return url.Parse(httpProxy)
				},
				DialContext: dialer.DialContext,
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: false,
				},
			},
		})
	}

	githubOauthConfig := c.auth2Config()

	if r.URL.Query().Get("error") != "" {
		resp.Err = errors.New(r.URL.Query().Get("error") + ": " + r.URL.Query().Get("error_description"))
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	token, err := githubOauthConfig.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		if strings.Contains(err.Error(), "server response missing access_token") {
			http.Redirect(w, r, c.config.GetString("server", "domain")+"/#/user/login", http.StatusPermanentRedirect)
		}
		_ = c.logger.Log("githubOauthConfig", "Exchange", "err", err.Error())
		resp.Err = err
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	if token == nil || !token.Valid() {
		_ = c.logger.Log("token", "nil", "or", "token.valid is false")
		resp.Err = errors.New("token is nil or token.valid is false")
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	client := github.NewClient(githubOauthConfig.Client(ctx, token))
	user, _, err := client.Users.Get(context.Background(), "")
	if err != nil {
		_ = c.logger.Log("client.users", "Get", "err", err.Error())
		resp.Err = err
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	if user == nil {
		resp.Err = ErrAuthLoginGitHubGetUser
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	authId := user.GetID()

	username := user.GetName()
	if username == "" {
		username = user.GetLogin()
	}

	oauthState, _ := r.Cookie("oauthstate")

	if r.FormValue("state") != oauthState.Value {
		_ = c.logger.Log("invalid", "oauth github state")
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	rs, member, err := c.AuthLogin(authId, user.GetEmail(), username)
	if err != nil {
		resp = authResponse{Err: err}
		_ = encodeLoginResponse(ctx, w, resp)
		return
	}

	//_ = c.casbin.GetEnforcer().LoadPolicy()

	params := url.Values{}
	params.Add("token", strings.Replace(rs, "Bearer ", "", -1))
	params.Add("username", member.Username)

	http.Redirect(w, r, c.config.GetString("server", "domain")+"/?"+params.Encode(), http.StatusPermanentRedirect)

}

func (c *service) AuthLogin(authId int64, email, username string) (rs string, member *types.User, err error) {
	member, err = c.repository.User().FindByAuthId(authId)

	if member == nil || err != nil {
		member = &types.User{
			Username: username,
			Email:    email,
			AuthId:   authId,
		}
		if err = c.repository.User().Create(member); err != nil {
			_ = c.logger.Log("User", "Create", "err", err.Error())
			return "", nil, err
		}
	}

	rs, err = c.sign(strconv.Itoa(int(authId)), member.Id)
	rs = "Bearer " + rs
	return
}

func (c *service) sign(authId string, uid int64) (string, error) {
	sessionTimeout, err := c.config.Int64("server", "session_timeout")
	if err != nil {
		sessionTimeout = 3600
	}
	expAt := time.Now().Add(time.Duration(sessionTimeout) * time.Second).Unix()

	// 创建声明
	claims := cbjwt.ArithmeticCustomClaims{
		UserId:   uid,
		Username: authId,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expAt,
			Issuer:    "system",
		},
	}

	//创建token，指定加密算法为HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 生成token
	return token.SignedString([]byte(cbjwt.GetJwtKey()))
}

func NewService(logger log.Logger, cf *config.Config, store repository.Repository) Service {
	logger = log.With(logger, "auth", "service")
	return &service{
		logger:     logger,
		config:     cf,
		repository: store,
	}
}
