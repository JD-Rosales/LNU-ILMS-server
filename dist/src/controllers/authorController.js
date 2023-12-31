"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveAuthors = exports.getALLAuthors = exports.getAuthor = exports.deleteAuthor = exports.updateAuthor = exports.createAuthor = void 0;
const zod_1 = __importDefault(require("zod"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const authorServices = __importStar(require("../services/authorServices"));
const customError_1 = __importDefault(require("../utils/customError"));
const createAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const Schema = zod_1.default.object({
            name: zod_1.default.string({ required_error: 'Author name is required.' }),
        });
        const validated = Schema.parse({ name });
        const author = yield authorServices.createAuthor(validated.name);
        return res.status(200).json(author);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.createAuthor = createAuthor;
const updateAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, status } = req.body;
        const Schema = zod_1.default.object({
            id: zod_1.default.number({ required_error: 'Author ID is required.' }),
            name: zod_1.default.string({ required_error: 'Author name is required.' }),
            status: zod_1.default.boolean({ required_error: 'Author status is required.' }),
        });
        const validated = Schema.parse({ id, name, status });
        const author = yield authorServices.updateAuthor(validated);
        return res.status(200).json(author);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.updateAuthor = updateAuthor;
const deleteAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const Schema = zod_1.default.object({
            id: zod_1.default.number({ required_error: 'Author ID is required.' }),
        });
        const validated = Schema.parse({ id });
        const author = yield authorServices.deleteAuthor(validated.id);
        return res.status(200).json(author);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.deleteAuthor = deleteAuthor;
const getAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const Schema = zod_1.default.object({
            id: zod_1.default
                .string({
                required_error: 'Author ID is required.',
                invalid_type_error: 'Author ID is not a valid ID.',
            })
                .transform((value) => parseInt(value)),
        });
        const validated = Schema.parse({ id });
        if (!validated.id)
            throw new customError_1.default(403, 'Author ID is required.');
        const author = yield authorServices.getAuthor(validated.id);
        return res.status(200).json(author);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getAuthor = getAuthor;
const getALLAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield authorServices.getALLAuthors();
        return res.status(200).json(authors);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getALLAuthors = getALLAuthors;
const getActiveAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield authorServices.getActiveAuthors();
        return res.status(200).json(authors);
    }
    catch (error) {
        (0, errorHandler_1.default)(error, res);
    }
});
exports.getActiveAuthors = getActiveAuthors;
