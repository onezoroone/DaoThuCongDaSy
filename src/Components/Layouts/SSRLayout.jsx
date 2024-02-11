import { Helmet } from "react-helmet";

function SSRLayout() {
    return (
            <>
                 <title>DAS - Dao Thủ Công Đa Sỹ</title>
                 <meta property="og:title" content="DAS - Dao Thủ Công Đa Sỹ" />
                 <meta name="description" content="Mua dao chất lượng, giá rẻ. Liên tục cập nhật những sản phẩm chất lượng do làng nghề rèn Đa Sỹ làm ra." />
                 <meta name="keywords" content="dao, keo, dao keo, dao chat luong tot, chat luong tot, dao thit ga, dao phay, dao bai thai, dao da sy, dao thu cong da sy, das, dao to, dao dai" />
                 <meta property="og:image" content="https://ik.imagekit.io/vi6fma9xb/logolink.png" />
                 <meta property="fb:app_id" content="948993069961078" />
                 <meta property="og:type" content="website" />
                 <meta property="og:description" content="Mua dao chất lượng, giá rẻ. Liên tục cập nhật những sản phẩm chất lượng do làng nghề rèn Đa Sỹ làm ra." />
                <meta property="og:url" content="http://localhost:5173/" />
                 <link rel="canonical" href="http://localhost:5173/" />
                <meta name="robots" content="index,follow" />
                 <meta name="ROBOTS" content="index,follow,noodp" />
                 <meta name="googlebot" content="index,follow" />
                <meta name="BingBOT" content="index,follow" />
                 <meta name="yahooBOT" content="index,follow" />
                 <meta name="slurp" content="index,follow" />
                 <meta name="msnbot" content="index,follow" />
         </>
    );
}

export default SSRLayout;