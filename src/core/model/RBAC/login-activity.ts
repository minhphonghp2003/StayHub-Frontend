// Based on: public class LoginActivity : BaseEntity
export interface LoginActivity {
    id: number;         // From BaseEntity
    time: string;       // DateTime comes as ISO string
    os?: string;
    ip?: string;
    userId: number;
    status: boolean;    // true = Success, false = Failed
    browser?: string;
}