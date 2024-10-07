const db = require('../models');

const methodsService = (Model) => {
    const methods = {
        find: async ({ where, findOne, include, page, pageSize, search, ...payload }) => {
            try {
                let data;
                if (where) {
                    if (where.id) {
                        data = await db[Model].findByPk(where.id, {
                            include: include,
                            raw: true,
                            ...payload,
                        });
                    } else if (findOne) {
                        data = await db[Model].findOne({
                            where: {
                                ...where,
                            },
                            include: include,
                            raw: true,
                            ...payload,
                        });
                    } else {
                        data = await db[Model].findAll({
                            include: include,
                            where: { ...where },
                            raw: true,
                            ...payload,
                        });
                    }
                } else if (page) {
                    const _page = +page < 1 ? 1 : +page;
                    const _pageSize = pageSize || +pageSize || 10;
                    const skip = (_page - 1) * _pageSize;

                    const { count, rows } = await db[Model].findAndCountAll({
                        where: {
                            ...search,
                        },
                        offset: skip,
                        limit: _pageSize,
                        include: include,
                        raw: true,
                        ...payload,
                    });
                    const pageNumber = Math.ceil(+count / +_pageSize);
                    data = {
                        meta: {
                            count,
                            page: _page,
                            pageSize: _pageSize,
                            pageNumber,
                        },
                        data: rows,
                    };
                } else {
                    data = await db[Model].findAll({ include: include, ...payload });
                }

                if (data) {
                    return {
                        code: 0,
                        message: 'ok',
                        data: data,
                    };
                } else {
                    return {
                        code: 1,
                        message: 'Data is not exist!',
                        data: [],
                    };
                }
            } catch (error) {
                console.log('🚀 ~ find: ~ error:', error);
                return {
                    code: -1,
                    message: 'Something wrong in the server',
                    data: { error },
                };
            }
        },
        create: async (payload) => {
            try {
                const [data, isCreated] = await db[Model].findOrCreate({
                    where: { ...payload },
                    raw: true,
                });

                if (isCreated) {
                    return {
                        code: 0,
                        // message: 'ok',
                        data: data,
                    };
                } else {
                    return {
                        code: 1,
                        message: 'Data was exist!',
                        data: [],
                    };
                }
            } catch (error) {
                console.log('🚀 ~ create: ~ error:', error);
                return {
                    code: -1,
                    message: 'Something wrong in the server',
                    data: { error },
                };
            }
        },
        update: async ({ where, data, ...payload }) => {
            try {
                const _data = await db[Model].update(
                    { ...data },
                    {
                        where: {
                            ...where,
                        },

                        ...payload,
                    },
                );

                console.log(_data);

                if (_data[0]) {
                    return {
                        code: 0,
                        message: 'ok',
                        data: _data,
                    };
                }

                return {
                    code: 1,
                    message: 'Data is not exist!',
                    data: [],
                };
            } catch (error) {
                return {
                    code: -1,
                    message: 'Something wrong in the server',
                    data: { error },
                };
            }
        },
        delete: async ({ where, ...payload }) => {
            try {
                const data = await db[Model].destroy({
                    where: {
                        ...where,
                    },
                });

                if (data) {
                    return {
                        code: 0,
                        message: 'ok',
                        data: data,
                    };
                }

                return {
                    code: 1,
                    message: 'Data is not exist!',
                    data: [],
                };
            } catch (error) {
                return {
                    code: -1,
                    message: 'Something wrong in the server',
                    data: { error },
                };
            }
        },
    };

    return methods;
};

module.exports = methodsService;
